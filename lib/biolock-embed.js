class BiolockEmbed {
    /**
     * Initialize the BioLock embed.
     * @param {Object} options - Configuration options for the embed.
     * @param {string|HTMLElement} options.container - Selector or DOM element where the iframe will be inserted.
     *
     * Options available for all pages:
     * @param {string} options.page - The BioLock page to display ('upload', 'download', 'createBiolink').
     * @param {string} [options.displayed_title] - Customizes the title of the page.
     * @param {string} [options.style] - CSS style string for the iframe.
     * @param {string} [options.primary_color] - Primary theme color (hex code string without '#') for the embedded UI.
     * @param {string} [options.lng] - Language code for the embedded UI (default is auto-detected).
     * @param {string} [options.feature_key] - Feature key or API key for BioLock (required for upload and biolink create page).
     *
     * Options available for uload page
     * @param {string} [options.displayed_data_section_title] - Customizes the title of the data section.
     * @param {string} [options.displayed_recipient_section_title] - Customizes the title of recipient section.
     * @param {string} [options.displayed_recipient_upload_message] - Customize the text next to the recipient’s upload button.
     * @param {boolean} [options.allow_files=true] - Allows the user to add file(s).
     * @param {boolean} [options.allow_multiple_files_upload=false] - Allows the user to add more than one file.
     * @param {boolean} [options.allow_message=true] - Allows the user to add a message.
     * @param {boolean} [options.allow_authorized_recipients=true] - Allows the user to specify recipients for the message.
     * @param {boolean} [options.liveness_component] - Select the liveness component. If not specified, use ‘advanced’ for premium Biolink users; otherwise, use ‘basic’.
     * @param {string} [options.ttl_days] - Customizes the TTL of the document. Values: 7 or 30. Defaults to 30 for premium Biolink users; otherwise, 7.
     * @param {string} [options.max_upload_file_size_mb=5] - Customizes max document upload size (MB). Values: 5 or 100. Defaults to 100 for premium Biolink users; otherwise, 5.
     * @param {string} [options.certify_sender=optional] - Certified selfie options: 'enabled', 'disabled', or 'optional'.
     *
     * Options available for download page
     * @param {string} [options.document_key] - The document key to download (required).
     * @param {string} [options.displayed_todo] - Customizes the To-Do text.
     * @param {boolean} [options.display_qr_code=true] - Displays the QR Code link to open the page from a mobile phone.
     * @param {string} [options.displayed_download_message] - Customizes the message that present what will be downloaded.
     * @param {string} [options.displayed_download_message_prefix] - Customizes the message that prefix the download text message.
     * @param {string} [options.displayed_download_files_prefix] - Customizes the message that prefix the files text message.
     * @param {string} [options.displayed_certified_sender] - Customizes the Certified sender text.
     * @param {boolean} [options.display_last_download=true] - Displays the last time that the document has been downloaded.
     * @param {boolean} [options.display_delete_button=true] - Displays the delete button, allowing the user to delete the message after delivery.
     * @param {boolean} [options.auto_files_download=false] - Force to immediately download the files after the selfie is checked. A message documentFilesAutoDownloaded is sent to the parent frame immediately after.
     *
     * Options available for createBiolink page
     * @param {string} [options.displayed_title] - Customizes the title of the download page.
     * @param {string} [options.displayed_creation_message] - Customizes the biolink creation message.
     * @param {string} [options.displayed_created_message] - Customizes the biolink created message.
     * @param {string} [options.biolink_status] - Customizes the status of the created biolink. It can be set to 'private' (user photo on the biolink will not be available) or 'basic' (the biolink which can be created from biolock.ai website).
     *
     *
     * Callbacks for specific events:
     * @param {function} [options.onPageLoaded] - Callback when the page is fully loaded. Receives the page name.
     * @param {function} [options.onCreatedDocument] - Callback when a document is successfully uploaded/created. Receives document info.
     * @param {function} [options.onCreatedBiolink] - Callback when a biolink is created. Receives biolink info.
     * @param {function} [options.onDocumentDelivery] - Callback when a document is delivered (downloaded by recipient).
     * @param {function} [options.onError] - Callback for any errors. Receives an error object or message.
     * @param {function} [options.onDocumentFilesAutoDownloaded] - Callback when files are auto-downloaded by the embed.
     * @param {function} [options.onDocumentAttributes] - Callback when document attributes are received.
     * @param {function} [options.onCertifiedSenderPhoto] - Callback when the document contain the certified photo of the sender. Receives the certified photo blob.
     * @param {function} [options.onJsonToParent] - Callback when a JSON is sent to the parent.
     * @param {function} [options.onDocumentNotFound] - Callback when a document is not found error occurs.
     * @param {function} [options.onBiolinkNotCreated] - Callback when a biolink is not created error occurs.
     */

    constructor(options) {
        if (!options || !options.container || !options.page) {
            throw new Error("BiolockEmbed: 'container' and 'page' options are required.");
        }

        // Resolve the container element from selector or element
        if (typeof options.container === 'string') {
            this.containerElement = document.querySelector(options.container);
        } else if (options.container instanceof HTMLElement) {
            this.containerElement = options.container;
        }
        if (!this.containerElement) {
            throw new Error("BiolockEmbed: Container element not found.");
        }

        // Save options and callbacks
        this.options = options;
        this.callbacks = {
            pageLoaded: options.onPageLoaded || null,
            createdDocument: options.onCreatedDocument || null,
            createdBiolink: options.onCreatedBiolink || null,
            biolinkNotCreated: options.onBiolinkNotCreated || null,
            documentDelivery: options.onDocumentDelivery || null,
            error: options.onError || null,
            documentFilesAutoDownloaded: options.onDocumentFilesAutoDownloaded || null,
            certifiedSenderPhoto: options.onCertifiedSenderPhoto || null,
            documentAttributes: options.onDocumentAttributes || null,
            jsonToParent: options.onJsonToParent || null,
            documentNotFound: options.onDocumentNotFound || null
        };

        // Create the iframe element
        this.iframe = document.createElement('iframe');
        // Construct the iframe URL with the appropriate page path and query parameters
        this.iframe.src = this._buildIframeUrl();
        this.iframe.style = this.options.style || ""; // apply custom styles if provided
        this.iframe.allow = "camera"; // allow camera for facial recognition
        this.iframe.setAttribute('allowfullscreen', 'true'); // allow fullscreen if BioLock uses it
        this.iframe.setAttribute('scrolling', 'no'); // avoid internal scroll if possible
        this.iframe.style.display = 'none';

        this.iframe.onload = () => {
            this.iframe.style.display = 'block';
        };


        // Insert the iframe into the container
        // Clear any existing content in container (optional, to ensure a clean state)
        this.containerElement.innerHTML = "";
        this.containerElement.appendChild(this.iframe);

        // Bind the message event handler to this instance
        this._handleMessage = this._handleMessage.bind(this);
        window.addEventListener('message', this._handleMessage, false);
    }

    /**
     * Build the BioLock iframe URL based on provided options.
     * Incorporates display_mode=reduced and any integration parameters like featureKey, colors, title.
     * @returns {string} The URL to use for the iframe src.
     */
    _buildIframeUrl() {
        let baseUrl = window.location.origin;
        if (!(['http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:8000', 'https://dev.biolock.ai', 'https://biolock.ai'].includes(baseUrl))) {
            baseUrl = 'https://biolock.ai';
        }
        let path = this.options.page;
        // Ensure path is one of the supported pages
        const allowedPages = ['upload', 'download', 'create-biolink'];
        if (!allowedPages.includes(path)) {
            console.error(`BiolockEmbed: Unknown page "${path}" specified. Defaulting to "/".`);
            path = '/';
        }
        if (this.options.page === 'download') {
            path = 'd'
        }
        if (this.options.page === 'createBiolink') {
            path = 'create-biolink'
        }
        // If the page is 'upload', it is the same url

        // Start with base URL and path
        let url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
        // Prepare query parameters
        const params = new URLSearchParams();
        params.set('display_mode', 'reduced');
        for (const key of Object.keys(this.options)) {
            if (!key.startsWith("on")) {
                // If it's not a known key and not a callback (which start with "on"), include it as param
                params.set(key, this.options[key]);
            }
        }
        // Append query string to URL
        const queryString = params.toString();
        if (queryString) {
            url += "?" + queryString;
        }
        if (this.options.document_key){
            url += this.options.document_key;
        }

        return url;
    }

    /**
     * Internal message event handler for postMessage events from the BioLock iframe.
     * Filters messages by origin and dispatches to the appropriate user callback if relevant.
     * @param {MessageEvent} event - The message event from the iframe.
     */
    _handleMessage(event) {
        // Verify the message comes from the BioLock iframe we embedded
        if (!event.source || event.source !== this.iframe.contentWindow) {
            return; // not from biolock iFrame
        }
        let data = event.data;
        if (data.source !== 'biolock') {
            return; // not from biolock iFrame
        }

        // Attempt to parse JSON string messages (in case the data is sent as a JSON string)
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                // If it's not JSON, it might be a simple string event name or unparseable data
                console.error("BiolockEmbed: Failed to parse message data (must be in JSON format):", e);
            }
        }


        // Route the event to the corresponding callback if provided
        switch (data.messageType) {
            case 'contentSize':
                this._resizeIframe(data.height);
                // data.width is not used
                break;
            case 'pageLoaded':
                this.iframe.contentWindow.postMessage({
                    source: 'parent', messageType: 'originProof',
                }, '*');
                if (this.callbacks.pageLoaded) {
                    try {
                        this.callbacks.pageLoaded(data.page);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;

            case 'documentAttributes':
                if (this.callbacks.documentAttributes) {
                    try {
                        const attributes = {firstDownloadedAt: data.firstDownloadedAt}
                        this.callbacks.documentAttributes(attributes);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;
            case 'jsonToParent':
                if (this.callbacks.jsonToParent) {
                    try {
                        this.callbacks.jsonToParent(data.json);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;
            case 'documentDelivery':
                if (this.callbacks.documentDelivery) {
                    try {
                        this.callbacks.documentDelivery(data.delivered);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;
            case 'documentFilesAutoDownloaded':
                if (this.callbacks.documentFilesAutoDownloaded) {
                    try {
                        this.callbacks.documentFilesAutoDownloaded(data.downloaded);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;
            case 'certifiedSenderPhoto':
                if (this.callbacks.certifiedSenderPhoto) {
                    try {
                        this.callbacks.certifiedSenderPhoto(data.photo);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;
            case 'createdDocument':
                if (this.callbacks.createdDocument) {
                    // The message might contain the document info under a property (e.g., doc or document)
                    const docInfo = {documentKey: data.documentKey, documentUrl: data.documentUrl};
                    try {
                        this.callbacks.createdDocument(docInfo);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;
            case 'createdBiolink':
                if (this.callbacks.createdBiolink) {
                    const biolinkInfo = {biolinkKey: data.biolinkKey, biolinkUrl: data.biolinkUrl};
                    try {
                        this.callbacks.createdBiolink(biolinkInfo);
                    } catch (err) {
                        console.error(err);
                    }
                }
                break;

            case 'error':
                if (data.errorCode && data.errorCode === 'documentNotFound') {
                    if (this.callbacks.documentNotFound) {
                        try {
                            this.callbacks.documentNotFound(data.errorMessage);
                        } catch (err) {
                            console.error(err);
                        }
                    } else if (this.callbacks.error) {
                        try {
                            this.callbacks.error(data.errorMessage);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                } else if (data.errorCode && data.errorCode === 'biolinkNotCreated') {
                    if (this.callbacks.biolinkNotCreated) {
                        try {
                            this.callbacks.biolinkNotCreated(data.errorMessage);
                        } catch (err) {
                            console.error(err);
                        }
                    } else if (this.callbacks.error) {
                        try {
                            this.callbacks.error(data);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                } else {
                    if (this.callbacks.error) {
                        const errorInfo = data.error || data.message || data;
                        try {
                            this.callbacks.error(errorInfo);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
                break;


            default:
                console.log("message from Biolock not handled" + data);
                break;
        }
    }

    /**
     * Adjust the iframe height to accommodate content.
     * @param {number} newHeight - The new height for the iframe (in pixels).
     */
    _resizeIframe(newHeight) {
        if (!newHeight || isNaN(newHeight)) return;
        this.iframe.style.height = newHeight + 'px';
    }

    /**
     * Add JSON to the Biolock iframe.
     * @param {Object} json - The JSON message object to send.
     */
    addJsonToDocument(json) {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({
                source: 'parent', messageType: 'addJsonToDocument', json: json
            }, '*');
        }
    }

        /**
     * Add JSON to the Biolock iframe.
     * @param {Object} json - The JSON message object to send.
     */
    setSenderPhotosFiles(photosFiles) {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({
                        source: 'parent',
                        messageType: 'setSenderPhotosFiles',
                        photosFiles: photosFiles
                    }, '*');
        }
    }
    /**
     * Destroy the BioLock embed instance by removing the iframe and event listeners.
     * After calling destroy(), this instance should not be used.
     */
    destroy() {
        // Remove the message event listener for this instance
        window.removeEventListener('message', this._handleMessage, false);
        // Remove the iframe from the DOM
        if (this.iframe && this.iframe.parentNode) {
            this.iframe.parentNode.removeChild(this.iframe);
        }
        // Clear references (optional, for garbage collection)
        this.iframe = null;
        this.containerElement = null;
        this.options = null;
        this.callbacks = null;
    }
}

// If using in a Node/CommonJS environment or bundler, export the class
// (This makes the library usable as an npm package as well.)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BiolockEmbed;
} else {
    // Otherwise, expose globally (for direct browser use)
    window.BiolockEmbed = BiolockEmbed;
}