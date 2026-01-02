// export default buildConfig({
//   collections: [Users, Service, Activity],
//   plugins: [
//     s3Storage({
//       collections: {
//         service: true,
//       },
//       bucket: 'service',
//       config: getStorageConfig(),
//     }),
//     s3Storage({
//       collections: {
//         activity: true,
//       },
//       bucket: 'activity',
//       config: getStorageConfig(),
//     }),
//   ],
// })

// function getStorageConfig() {
//   return {
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY_ID!,
//       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
//     },
//     region: process.env.S3_REGION,
//     endpoint: process.env.S3_ENDPOINT,
//     forcePathStyle: true,
//   }
// }

export function getDayBasedPath() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0') // '01', '02', ..., '12'
  const day = now.getDate().toString().padStart(2, '0') // '01', '02', ..., '31'

  // This will return a string like "2025/11/02"
  return `${year}/${month}/${day}`
}

export function getUploadPrefix(doc: any): string {
  // Read the category from the document.
  // Default to 'general' if it's not set.
  const category = doc.category || 'general'

  // Return the new dynamic path
  // Example: xyz/legal
  return `${category}/${getDayBasedPath()}`
}
