import { getApiDocs } from '../lib/swagger/swagger'
import SwaggerUIComponent from './SwaggerUI'

export default async function ApiDocsPage() {
  const spec = getApiDocs()
  return <SwaggerUIComponent spec={spec} />
}