# BioLockEmbed (Beta)

BioLockEmbed is a lightweight and user-friendly JavaScript library designed to simplify the integration of your BioLock iframe into a parent website. 

With an intuitive API, it streamlines communication between the iframe and your web application while offering extensive customization options.

Documentation for integrating BioLock without using this library is available here: https://biolock.ai/public/files/docs/DocAPI.docx and the BioLock API documentation is available here: http://biolock.ai/docs.


## Features

- **Easy Integration:** Embed BioLock pages (upload, download, or createBiolink) into your website effortlessly.
- **Customizable UI:** Configure titles, dimensions, styles, colors, and more to match your website’s design.
- **Event Callbacks:** Handle various events such as page load, document creation, errors, and more with callback functions.
- **Responsive Iframe:** Automatically adjusts the iframe height based on the content.

## Installation

Include the `biolock-embed.js` file in your project by downloading it or using a package manager if available. Then, add it to your HTML file:

```html
<script src="path/to/biolock-embed.js"></script>
```

## Usage

### Simple Integration Example

Below is a basic example demonstrating how to embed a BioLock “upload” page into your website:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BioLockEmbed Integration Example</title>
</head>
<body>
  <!-- Container where the BioLock iframe will be inserted -->
  <div id="biolock-container"></div>

  <!-- Include the BioLockEmbed library -->
  <script src="path/to/biolock-embed.js"></script>
  <script>
    // Initialize BioLockEmbed with configuration options
    var biolock = new BiolockEmbed({
      container: '#biolock-container',  // DOM selector for the container
      page: 'upload',                    // Page to display: 'upload', 'download', or 'createBiolink'
      displayed_title: 'Upload Your Document', // Custom title for the page
      width: '100%',                     // Iframe width (can be a percentage or pixel value)
      min_height: '400px',               // Minimum height of the iframe
      primary_color: 'FF5733',           // Primary theme color (hex code without #)
      feature_key: 'YOUR_FEATURE_KEY',   // API key required for upload and biolink creation

      // Callback: when the BioLock page is loaded
      onPageLoaded: function(page) {
        console.log('BioLock page loaded:', page);
      },
      // Callback: when a document is successfully uploaded/created
      onCreatedDocument: function(docInfo) {
        console.log('Document created:', docInfo);
      },
      // Callback: for handling errors
      onError: function(error) {
        console.error('BioLock error:', error);
      }
    });
  </script>
</body>
</html>
```

## API Documentation

### Constructor

The `BiolockEmbed` constructor accepts an options object with the following parameters:

#### Common Options (available for all pages):
- **container** (string or HTMLElement, required): Selector or DOM element where the iframe will be inserted.
- **page** (string, required): The BioLock page to display. Supported values: `upload`, `download`, or `createBiolink`.
- **displayed_title** (string, optional): Customizes the title of the page.
- **style** (string, optional): CSS style string for the iframe.
- **primary_color** (string, optional): Primary theme color (hex code string without '#') for the embedded UI.
- **lng** (string, optional): Language code for the embedded UI (default is auto-detected).
- **feature_key** (string, optional): Feature key or API key for BioLock (required for `upload` and `createBiolink` pages).

#### Options for the Upload Page:
- **displayed_data_section_title** (string, optional): Customizes the title of the data section.
- **displayed_recipient_section_title** (string, optional): Customizes the title of the recipient section.
- **displayed_recipient_upload_message** (string, optional): Customize the text next to the recipient’s upload button.
- **allow_files** (boolean, optional, default: true): Allows the user to add file(s).
- **allow_multiple_files_upload** (boolean, optional, default: false): Allows the user to add more than one file.
- **allow_message** (boolean, optional, default: true): Allows the user to add a message.
- **allow_authorized_recipients** (boolean, optional, default: true): Allows the user to specify recipients for the message.
- **liveness_component** (boolean, optional): Select the liveness component. If not specified, use `advanced` for premium Biolock users; otherwise, use `basic`.
- **ttl_days** (string, optional): Customizes the TTL of the document. Values: `7` or `30`. Defaults to `30` for premium Biolock users; otherwise, `7`.
- **max_upload_file_size_mb** (string, optional, default: `5`): Customizes max document upload size (MB). Values: `5` or `100`. Defaults to `100` for premium Biolock users; otherwise, `5`.
- **certify_sender** (string, optional, default: `optional`): Certified selfie options: `enabled`, `disabled`, or `optional`.

#### Options for the Download Page:
- **document_key** (string, optional): The document key to download (required).
- **displayed_todo** (string, optional): Customizes the To-Do text.
- **display_qr_code** (boolean, optional, default: true): Displays the QR Code link to open the page from a mobile phone.
- **displayed_download_message** (string, optional): Customizes the message that presents what will be downloaded.
- **displayed_download_message_prefix** (string, optional): Customizes the message that prefixes the download text message.
- **displayed_download_files_prefix** (string, optional): Customizes the message that prefixes the files text message.
- **displayed_certified_sender** (string, optional): Customizes the Certified sender text.
- **display_last_download** (boolean, optional, default: true): Displays the last time that the document has been downloaded.
- **display_delete_button** (boolean, optional, default: true): Displays the delete button, allowing the user to delete the message after delivery.
- **auto_files_download** (boolean, optional, default: false): Forces immediate file download after the selfie is checked. A `documentFilesAutoDownloaded` message is sent to the parent frame immediately after.

#### Options for the CreateBiolink Page:
- **displayed_title** (string, optional): Customizes the title of the download page.
- **displayed_creation_message** (string, optional): Customizes the biolink creation message.
- **displayed_created_message** (string, optional): Customizes the biolink created message.
- **biolink_status** (string, optional): Customizes the status of the created biolink. It can be set to `private` (user photo on the biolink will not be available) or `basic` (the biolink which can be created from the biolock.ai website).

#### Callbacks:
- **onPageLoaded** (function, optional): Callback when the page is fully loaded. Receives the page name.
- **onCreatedDocument** (function, optional): Callback when a document is successfully uploaded/created. Receives document info.
- **onCreatedBiolink** (function, optional): Callback when a biolink is created. Receives biolink info.
- **onDocumentDelivery** (function, optional): Callback when a document is delivered (downloaded by recipient).
- **onError** (function, optional): Callback for any errors. Receives an error object or message.
- **onDocumentFilesAutoDownloaded** (function, optional): Callback when files are auto-downloaded by the embed.
- **onDocumentAttributes** (function, optional): Callback when document attributes are received.
- **onCertifiedSenderPhoto** (function, optional): Callback when the document contain the certified photo of the sender. Receives the certified photo blob.
- **onJsonToParent** (function, optional): Callback when a JSON is sent to the parent.
- **onDocumentNotFound** (function, optional): Callback when a document is not found error occurs.
- **onBiolinkNotCreated** (function, optional): Callback when a biolink is not created error occurs.

### Methods

- **addJsonToDocument(json)**
  
  Sends a JSON object to the BioLock iframe.
  
  ```javascript
  biolock.addJsonToDocument({ key: 'value' });
  ```

- **setSenderPhotosFiles(photosFiles)**
  
  Sends an array of sender photos or files to the BioLock iframe.
  
  ```javascript
  biolock.setSenderPhotosFiles(['photo1.jpg', 'photo2.jpg']);
  ```

- **destroy()**
  
  Destroys the BioLockEmbed instance by removing the iframe and associated event listeners.
  
  ```javascript
  biolock.destroy();
  ```

## Contributing

Contributions are welcome! Please submit issues or pull requests through the project’s repository.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on the project’s GitHub page.

---

This README provides an overview, usage instructions, and API details to help you quickly integrate and customize the BioLockEmbed library on your website.