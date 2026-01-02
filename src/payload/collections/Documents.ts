import type { CollectionConfig } from 'payload'
import { authenticated } from '@/payload/access/authenticated'

// Define the Documents collection
export const Documents: CollectionConfig = {
  // The slug is used to identify the collection in the API and the database
  slug: 'documents',

  // Define this as an 'upload' collection
  upload: {
    // This allows the collection to be used for file uploads.
    // The actual storage adapter (like the S3 plugin) is configured in your main payload.config.ts,
    // which will then handle the storage for any collection specified in its 'collections' array.
    // You can define image size constraints here if you expect image documents,
    // but for general documents, it might not be necessary.
    // imageSizes: [
    //   {
    //     name: 'thumbnail',
    //     width: 480,
    //     height: 320,
    //   },
    // ],
  },

  // Access control settings
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },

  // Admin UI settings
  admin: {
    // Use the filename as the main title in the admin panel list view
    useAsTitle: 'filename',
    // A description for the collection in the admin panel
    description:
      'A collection for uploading various types of documents like PDFs, DOCX files, etc.',
    // Group this collection under 'Uploads' in the admin sidebar
    group: 'General',
  },

  // Fields for the collection
  fields: [
    // You can add custom fields here to store metadata about the document
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
      admin: {
        description: 'A brief description of the document for accessibility.',
      },
    },
    {
      name: 'category',
      label: 'Document Category',
      type: 'select',
      options: [
        { label: 'Report', value: 'report' },
        { label: 'Legal', value: 'legal' },
        { label: 'Presentation', value: 'presentation' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
