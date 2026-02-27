/**
 * Comprime una imagen para que no exceda el tamaño máximo permitido
 */

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const MAX_DIMENSION = 4096 // Máximo ancho/alto en píxeles
const COMPRESSION_QUALITY = 0.85 // Calidad JPEG/WebP

export async function compressImage(file: File): Promise<File> {
  // Si no es una imagen, retornar el archivo original
  if (!file.type.startsWith('image/')) {
    return file
  }

  // Si ya es pequeño, retornar el original
  if (file.size <= MAX_FILE_SIZE) {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'))
      
      img.onload = () => {
        try {
          // Calcular nuevas dimensiones manteniendo aspect ratio
          let { width, height } = img
          
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width)
              width = MAX_DIMENSION
            } else {
              width = Math.round((width * MAX_DIMENSION) / height)
              height = MAX_DIMENSION
            }
          }

          // Crear canvas y dibujar imagen redimensionada
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('No se pudo crear contexto de canvas'))
            return
          }

          // Dibujar con mejor calidad
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          // Convertir a blob con compresión
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al comprimir la imagen'))
                return
              }

              // Crear nuevo archivo con el blob comprimido
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '.jpg'), // Cambiar extensión a .jpg
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              )

              console.log(`Imagen comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
              resolve(compressedFile)
            },
            'image/jpeg',
            COMPRESSION_QUALITY
          )
        } catch (err) {
          reject(err)
        }
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}
