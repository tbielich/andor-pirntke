const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const media = "bundeswehr";

module.exports = async () => {
  // get all image folder
  const subfolders = await cloudinary.api.sub_folders(
    (media), (err, result) => {
      if (err) {
        console.error("ERROR:", err);
      }
      return result
    }
  );

  const enhancedFolders = await Promise.all(
    subfolders.folders.map(async (folder) => {
      let newFolder = {...folder};
      newFolder.path = slugify(folder.path);
      newFolder.id = slugify(folder.name);
      newFolder.images = [];

      return await cloudinary.api.resources({
        resource_type: "image",
        type: "upload",
        prefix: media + "/" + folder.name,
        max_results: 100
      }, (err, result) => {
          if (err) {
            console.error("ERROR:", err);
          }
          return result
        }
      ).then((res) => {
        newFolder.images = res.resources.map((resource) => {
          resource.fullscreen_url = process.env.RES_ENDPOINT + resource.public_id + "." + resource.format;
          resource.path = (slugify(resource.public_id) + "." + resource.format);
          resource.folder = media + "/" + resource.path.split('/')[1];
          // console.log(resource);
          return resource
        });

        return newFolder
      });
    })
  );

  // console.log(enhancedFolders)

  return {
    folders: enhancedFolders
  }
}

function slugify(key) {
  key = key.toLowerCase();
  key = key.replace(/\.png/g, '');
  key = key.replace(/\.jpg/g, '');
  key = key.replace(/\.pdf/g, '');
  key = key.replace(/ä/g, 'ae');
  key = key.replace(/ö/g, 'oe');
  key = key.replace(/ü/g, 'ue');
  key = key.replace(/ß/g, 'ss');
  key = key.replace(/_/g, '-');
  key = key.replace(/ /g, '-');
  key = key.replace(/&/g, 'und');
  key = key.replace(/\./g, '');
  key = key.replace(/,/g, '');
  key = key.replace(/\(/g, '');
  key = key.replace(/\)/g, '');
  key = key.replace(/\?/g, '');
  key = key.replace(/:/g, '');
  key = key.replace(/"/g, '');
  return key;
}
