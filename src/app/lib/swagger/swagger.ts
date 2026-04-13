import { createSwaggerSpec } from 'next-swagger-doc'

export function getApiDocs() {
  return createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Documentacion de la API  de catalogo de ropa',
        version: '1.0.3',
        description: 'API del catalogo de productos',
      },
    },
  }) as Record<string, unknown>
}