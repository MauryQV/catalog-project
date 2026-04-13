import { v2 as cloudinary } from 'cloudinary'

//CONFIGURACION DE LAS VARIABLES DE ENTORNO
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// constructor de urls
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number
    fit?: 'fill' | 'crop' | 'scale' | 'thumb'
  } = {}
) {
  const { width = 400, height = 400, quality = 80, fit = 'fill' } = options
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${fit},q_${quality},f_auto/${publicId}`
}