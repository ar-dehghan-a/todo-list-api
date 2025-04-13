const {createClient} = require('@supabase/supabase-js')
const sharp = require('sharp')

const supabaseUrl = process.env['SUPABASE_URL']
const supabaseKey = process.env['SUPABASE_KEY']
const supabase = createClient(supabaseUrl, supabaseKey)

const BUCKET_NAME = process.env['BUCKET_NAME']

const uploadFileStorage = async (fileBuffer, fileName, mimetype) => {
  try {
    let processedBuffer = fileBuffer

    // Process images with sharp
    if (mimetype.startsWith('image/'))
      processedBuffer = await sharp(fileBuffer).toFormat('jpeg').jpeg({quality: 90}).toBuffer()

    const {data, error} = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, processedBuffer, {
        contentType: mimetype,
      })

    if (error) throw error

    // Get public URL
    const {
      data: {publicUrl},
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

    return {
      path: data.path,
      url: publicUrl,
      size: processedBuffer.length,
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

const deleteFileStorage = async filePath => {
  try {
    const {error} = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

module.exports = {
  uploadFileStorage,
  deleteFileStorage,
}
