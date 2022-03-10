function pageLoaded()
{
    HTMLViewController.pageLoaded();
    ExtensionsPreferencesViewController.load();
    ExtensionsPreferencesView.pageDidLoad();
}

function removeIfExists(element)
{
    if (element)
        element.remove();
}

Extension = function(identifier)
{
    this.identifier = identifier;

    this.initialize();
}

Extension.prototype = {
    get enabled()
    {
        return ExtensionsPreferencesViewController.extensionEnabled(this.identifier);
    },

    set enabled(value)
    {
        ExtensionsPreferencesViewController.setExtensionEnabled(this.identifier, value);
    },

    get enabledInPrivateBrowsingWindows()
    {
        return ExtensionsPreferencesViewController.extensionEnabledInPrivateBrowsingWindows(this.identifier);
    },

    set enabledInPrivateBrowsingWindows(value)
    {
        ExtensionsPreferencesViewController.setExtensionEnabledInPrivateBrowsingWindows(this.identifier, value);
    },

    get warningText()
    {
        return ExtensionsPreferencesViewController.extensionWarningText(this.identifier);
    },

    get authorName()
    {
        return ExtensionsPreferencesViewController.extensionAuthorName(this.identifier);
    },

    get description()
    {
        return ExtensionsPreferencesViewController.extensionDescription(this.identifier);
    },

    get displayName()
    {
        return ExtensionsPreferencesViewController.extensionDisplayName(this.identifier);
    },

    get version()
    {
        return ExtensionsPreferencesViewController.extensionVersion(this.identifier);
    },

    get websiteURL()
    {
        return ExtensionsPreferencesViewController.extensionWebsiteURL(this.identifier);
    },

    get optionsURL()
    {
        return ExtensionsPreferencesViewController.extensionOptionsURL(this.identifier);
    },

    get enableInPrivateBrowsingWindowsString()
    {
        return ExtensionsPreferencesViewController.enableInPrivateBrowsingWindowsString(this.identifier);
    },

    get isSignedByApple()
    {
        return ExtensionsPreferencesViewController.extensionIsSignedByApple(this.identifier);
    },

    get websiteAccess()
    {
        return ExtensionsPreferencesViewController.websiteAccess(this.identifier);
    },

    get containingAppDisplayName()
    {
        return ExtensionsPreferencesViewController.extensionContainingAppDisplayName(this.identifier);
    },

    select: function()
    {
        ExtensionsPreferencesView.selectedExtension = this;
    },

    initialize: function()
    {
        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("role", "checkbox");
        checkbox.classList.add("enableCheckboxButton");
        checkbox.addEventListener("change", this.enableButtonClicked.bind(this), false);
        checkbox.checked = this.enabled;

        var icon = document.createElement("img");
        icon.src = this.smallIconURL(IconResolution.LowResolution);
        icon.classList.add("icon");
        icon.classList.add("low-res");
        icon.setAttribute("alt", "");

        var highResIcon = document.createElement("img");
        highResIcon.src = this.smallIconURL(IconResolution.HighResolution);
        highResIcon.classList.add("icon");
        highResIcon.classList.add("high-res");
        highResIcon.setAttribute("alt", "");

        var displayName = this.displayName;

        this.sidebarElement = document.createElement("div");
        this.sidebarElement.appendChild(checkbox);
        this.sidebarElement.appendChild(icon);
        this.sidebarElement.appendChild(highResIcon);

        var titleContainer = document.createElement("div");
        titleContainer.classList.add("titleContainer");

        var titleElement = document.createElement("div");
        titleElement.classList.add("title");
        titleElement.appendChild(document.createTextNode(displayName));

        titleContainer.appendChild(titleElement);

        this.updateWarningIconInTitleContainerIfNecessary(titleContainer);

        this.sidebarElement.appendChild(titleContainer);

        this.sidebarElement.classList.add("item");
        if (!this.enabled)
            this.sidebarElement.classList.add("disabled");

        this.sidebarElement.addEventListener("click", this.sidebarItemSelected.bind(this), false);
        this.sidebarElement.setAttribute("aria-flowto", "contentView");
        this.sidebarElement.setAttribute("aria-label", displayName);

        // Add reference back to the Extension object.
        this.sidebarElement.extension = this;
        this.sidebarElement.checkbox = checkbox;
    },

    display: function()
    {
        document.getElementById("low-res-icon").src = this.iconURL(IconResolution.LowResolution);
        document.getElementById("high-res-icon").src = this.iconURL(IconResolution.HighResolution);
        document.getElementById("low-res-icon").setAttribute("alt", HTMLViewController.UIString("%@ icon").format(this.displayName));
        document.getElementById("high-res-icon").setAttribute("alt", HTMLViewController.UIString("%@ icon").format(this.displayName));

        document.getElementById("title").textContent = this.displayName + " " + this.version;
        document.getElementById("description").textContent = this.description;
        document.getElementById("enableInPrivateBrowsingWindowsCheckboxLabel").textContent = this.enableInPrivateBrowsingWindowsString;

        if (this.warningText) {
            document.getElementById("warning").classList.remove("hidden");
            document.getElementById("warningText").innerText = this.warningText;
        } else
            document.getElementById("warning").classList.add("hidden");

        var webpageContentsSection = document.getElementById("webpageContents");
        var browsingHistorySection = document.getElementById("browsingHistory");
        var trackingInformationSection = document.getElementById("trackingInformation");

        var websiteAccessTitle = document.getElementById("websiteAccessTitle");
        websiteAccessTitle.textContent = "";

        var websiteAccess = this.websiteAccess;
        if (websiteAccess) {
            var accessLevel = websiteAccess["Level"];
            if (accessLevel === "All" || accessLevel === "Some") {
                websiteAccessTitle.textContent = HTMLViewController.UIString("Permissions for “%@”:").format(this.displayName);

                var webpageContentsDomainList = document.getElementById("webpageContentsDomainList");
                var browsingHistoryDomainList = document.getElementById("browsingHistoryDomainList");

                webpageContentsDomainList.innerHTML = "";
                browsingHistoryDomainList.innerHTML = "";

                if (accessLevel === "All") {
                    var allWebpagesListItem = document.createElement("li");
                    allWebpagesListItem.textContent = HTMLViewController.UIString("all webpages");

                    webpageContentsDomainList.appendChild(allWebpagesListItem.cloneNode(true));
                    browsingHistoryDomainList.appendChild(allWebpagesListItem.cloneNode(true));
                } else {
                    var allowedDomains = websiteAccess["Allowed Domains"];
                    var numberOfAllowedDomains = allowedDomains.length;

                    for (var i = 0; i < numberOfAllowedDomains; ++i) {
                        var allowedDomainListItem = document.createElement("li");
                        allowedDomainListItem.textContent = allowedDomains[i];

                        webpageContentsDomainList.appendChild(allowedDomainListItem.cloneNode(true));
                        browsingHistoryDomainList.appendChild(allowedDomainListItem.cloneNode(true));
                    }
                }

                browsingHistorySection.classList.remove("hidden");

                if (websiteAccess["Has Injected Content"])
                    webpageContentsSection.classList.remove("hidden");
                else
                    webpageContentsSection.classList.add("hidden");

                var allowedDomainsForHeaderInjection = websiteAccess["Allowed Domains for Header Injection"];
                if (allowedDomainsForHeaderInjection) {
                    trackingInformationSection.classList.remove("hidden");

                    var trackingInformationDomainList = document.getElementById("trackingInformationDomainList");
                    trackingInformationDomainList.innerHTML = "";

                    var numberOfAllowedDomainsForHeaderInjection = allowedDomainsForHeaderInjection.length;
                    for (var i = 0; i < numberOfAllowedDomainsForHeaderInjection; ++i) {
                        var allowedDomainListItem = document.createElement("li");
                        allowedDomainListItem.textContent = allowedDomainsForHeaderInjection[i];

                        trackingInformationDomainList.appendChild(allowedDomainListItem);
                    }
                } else
                    trackingInformationSection.classList.add("hidden");
            } else {
                browsingHistorySection.classList.add("hidden");
                webpageContentsSection.classList.add("hidden");
                trackingInformationSection.classList.add("hidden");

                if (accessLevel === "NoneForContentBlocker")
                    websiteAccessTitle.textContent = HTMLViewController.UIString("“%@” does not have permission to read or transmit content from any webpages.").format(this.displayName);
                else
                    websiteAccessTitle.textContent = HTMLViewController.UIString("“%@” does not have permission to read, modify, or transmit content from any webpages.").format(this.displayName);
            }
        }

        var authorElement = document.getElementById("author");
        authorElement.textContent = "";

        if (this.authorName) {
            if (this.websiteURL) {
                var linkElement = document.createElement("a");
                linkElement.href = this.websiteURL;
                authorElement.appendChild(linkElement);
                authorElement = linkElement;
            }

            authorElement.textContent = HTMLViewController.UIString("by %@").format(this.authorName);
        } else if (this.containingAppDisplayName)
            authorElement.textContent = HTMLViewController.UIString("from %@").format(this.containingAppDisplayName);

        if (this.enabled && this.optionsURL)
            document.getElementById("optionsButton").classList.remove("hidden");
        else
            document.getElementById("optionsButton").classList.add("hidden");

        this.updateEnableButtons();
        this.updateEnableInPrivateBrowsingWindowsButton();
    },

    enableButtonClicked: function(event)
    {
        // Uncheck the enable checkbox for now, extensionStateChanged() may check it again based on
        // the user’s response to the trust confirmation alert (if displayed).
        event.target.checked = false;
        this.enabled = !this.enabled;
    },

    updateEnableButtons: function()
    {
        this.sidebarElement.checkbox.checked = this.enabled;
        // FIXME 25223679: Investigate how enable in private browsing windows checkbox should be placed.
        if (this.enabled) {
            document.getElementById("enableInPrivateBrowsingWindowsCheckbox").style.color = "black";
            document.getElementById("enableInPrivateBrowsingWindowsCheckboxButton").disabled = false;
        } else {
            document.getElementById("enableInPrivateBrowsingWindowsCheckbox").style.color = "gray";
            document.getElementById("enableInPrivateBrowsingWindowsCheckboxButton").disabled = true;
        }

        if (this.enabled && this.optionsURL)
            document.getElementById("optionsButton").classList.remove("hidden");
        else
            document.getElementById("optionsButton").classList.add("hidden");

    },

    updateEnableInPrivateBrowsingWindowsButton: function()
    {
        if (!this.enableInPrivateBrowsingWindowsString)
            return;

        document.getElementById("enableInPrivateBrowsingWindowsCheckboxButton").checked = this.enabledInPrivateBrowsingWindows;
    },

    sidebarItemSelected: function(event)
    {
        this.select();
    },

    iconURL: function(resolution)
    {
        return ExtensionsPreferencesViewController.extensionIconURL(this.identifier, resolution);
    },

    largeIconURL: function(resolution)
    {
        return ExtensionsPreferencesViewController.extensionLargeIconURL(this.identifier, resolution);
    },

    smallIconURL: function(resolution)
    {
        return ExtensionsPreferencesViewController.extensionSmallIconURL(this.identifier, resolution);
    },

    updateWarningIconInTitleContainerIfNecessary: function(titleContainer)
    {
        if (!this.warningText) {
            let warningIcon = titleContainer.querySelector(".warning");
            if (!warningIcon)
                return;

            warningIcon.remove();
            return;
        }

        if (titleContainer.getElementsByClassName("warning").length)
            return;

        var warningIcon = document.createElement("img");
        warningIcon.src = "WarningIcon.png";
        warningIcon.classList.add("warning");
        warningIcon.alt = HTMLViewController.UIString("Warning Icon");
        titleContainer.appendChild(warningIcon);
    }
}

var ExtensionsPreferencesView = {
    _selectedExtension: null,

    // All installed extensions in installation order
    extensions: [],

    // Map from identifiers to their Extension objects
    extensionsByIdentifier: {},

    setTextDirection: function(textDirection)
    {
        document.documentElement.setAttribute("dir", textDirection);
    },

    updateContentViewPlaceholder: function()
    {
        var contentViewPlaceholderId = "contentView-placeholder";
        if (this.extensions.length)
            document.getElementById(contentViewPlaceholderId).classList.add("hidden");
        else
            document.getElementById(contentViewPlaceholderId).classList.remove("hidden");
    },

    pageDidLoad: function()
    {
        this.extensionsEnabledStateChanged(this.extensionsEnabled);

        document.getElementById("enableInPrivateBrowsingWindowsCheckboxButton").addEventListener("change", this.enableInPrivateBrowsingWindowsButtonClicked.bind(this), false);
        document.getElementById("uninstallButton").addEventListener("click", this.uninstallButtonClicked.bind(this), false);
        document.getElementById("optionsButton").addEventListener("click", this.optionsButtonClicked.bind(this), false);
        document.getElementById("sidebar").addEventListener("keydown", this.sidebarKeyDown.bind(this), false);

        document.getElementById("sidebar").focus();

        document.documentElement.setAttribute("aria-label", HTMLViewController.UIString("Extensions"));
        document.getElementById("sidebar").setAttribute("aria-label", HTMLViewController.UIString("Extensions"));
        document.getElementById("contentView").setAttribute("aria-label", HTMLViewController.UIString("Extension Info"));

        this.updateContentViewPlaceholder();
    },
    
    pageUnloaded: function()
    {
        ExtensionsPreferencesViewController.unload();
    },

    addExtension: function(identifier)
    {
        if (this.extensionsByIdentifier[identifier])
            return;

        var extension = new Extension(identifier);
        this.extensions.push(extension);

        this.extensions.sort(function(extensionA, extensionB) {
            let extensionADisplayName = extensionA.displayName;
            let extensionBDisplayName = extensionB.displayName;
            let extensionAContainingAppName = extensionA.containingAppDisplayName;
            let extensionBContainingAppName = extensionB.containingAppDisplayName;

            if (extensionAContainingAppName && extensionBContainingAppName) {
                let extensionACombinedName = extensionAContainingAppName + " " + extensionADisplayName;
                let extensionBCombinedName = extensionBContainingAppName + " " + extensionBDisplayName;
                return extensionACombinedName.localeCompare(extensionBCombinedName);
            } if (extensionAContainingAppName)
                return -1;
            if (extensionBContainingAppName)
                return 1;

            return extensionADisplayName.localeCompare(extensionBDisplayName);
        });

        this.extensionsByIdentifier[identifier] = extension;

        let nextExtensionElement = this.extensions[this.extensions.indexOf(extension) + 1];
        document.getElementById("extensionList").insertBefore(extension.sidebarElement, nextExtensionElement ? nextExtensionElement.sidebarElement : null);

        this.updateContentViewPlaceholder();
    },

    removeExtension: function(identifier)
    {
        var extension = this.extensionsByIdentifier[identifier];
        if (!extension)
            return;

        // Before removing the extension from the sidebar, determine the next extension to focus in the sidebar.
        if (this.selectedExtension == extension) {
            if (extension.sidebarElement.nextSibling)
                extension.sidebarElement.nextSibling.extension.select();
            else if (extension.sidebarElement.previousSibling)
                extension.sidebarElement.previousSibling.extension.select();
            else {
                // There are no installed extensions remaining.
                this.selectedExtension = null;
            }
        }

        // Remove the sidebar element of this extension.
        document.getElementById("extensionList").removeChild(extension.sidebarElement);

        this.extensions.remove(this.extensionsByIdentifier[identifier], true);
        delete this.extensionsByIdentifier[identifier];

        this.updateContentViewPlaceholder();
    },

    selectExtension: function(identifier)
    {
        var extension = this.extensionsByIdentifier[identifier];
        if (!extension)
            return;
        extension.select();
    },

    extensionStateChanged: function(identifier, enabled)
    {
        var extension = this.extensionsByIdentifier[identifier];
        if (!extension)
            return;

        if (enabled)
            extension.sidebarElement.classList.remove("disabled");
        else
            extension.sidebarElement.classList.add("disabled");

        extension.updateEnableButtons();
    },

    extensionsEnabledStateChanged: function(enabled)
    {
        if (enabled) {
            document.body.classList.remove("collapsed");
            ExtensionsPreferencesViewController.resizeWindowToEnabledHeight();
            return;
        }

        this.selectedExtension = null;
        document.getElementById("extensionList").removeChildren();

        document.body.classList.add("collapsed");
        ExtensionsPreferencesViewController.resizeWindowToDisabledHeight();

        this.extensions = [];
        this.extensionsByIdentifier = {};
    },

    get extensionsEnabled()
    {
        return ExtensionsPreferencesViewController.extensionsEnabled();
    },

    extensionWarningTextChanged: function(identifier)
    {
        var extension = this.extensionsByIdentifier[identifier];
        if (!extension)
            return;

        var sidebarTitleContainer = extension.sidebarElement.getElementsByClassName("titleContainer")[0];
        console.assert(sidebarTitleContainer);
        extension.updateWarningIconInTitleContainerIfNecessary(sidebarTitleContainer);

        if (this.selectedExtension === extension)
            extension.display();
    },

    sidebarKeyDown: function(event)
    {
        if (!this.extensions.length)
            return;

        var handled = false;

        var selectedSidebarElement;
        if (this.selectedExtension)
            selectedSidebarElement = this.selectedExtension.sidebarElement;

        if (event.keyIdentifier === "Up") {
            if (selectedSidebarElement) {
                if (selectedSidebarElement.previousSibling)
                  selectedSidebarElement.previousSibling.extension.select();  
            }

            handled = true;
        } else if (event.keyIdentifier === "Down") {
            if (selectedSidebarElement && selectedSidebarElement.nextSibling)
                selectedSidebarElement.nextSibling.extension.select();
                
            handled = true;
        }

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    enableInPrivateBrowsingWindowsButtonClicked: function(event)
    {
        if (!this.selectedExtension)
            return;
        this.selectedExtension.enabledInPrivateBrowsingWindows = !this.selectedExtension.enabledInPrivateBrowsingWindows;
    },

    uninstallButtonClicked: function(event)
    {
        if (!this.selectedExtension)
            return;
        ExtensionsPreferencesViewController.uninstallExtension(this.selectedExtension.identifier);
    },

    optionsButtonClicked: function(event)
    {
        if (!this.selectedExtension)
            return;
        ExtensionsPreferencesViewController.showOptionsForExtension(this.selectedExtension.identifier);
    },

    get selectedExtension()
    {
        return this._selectedExtension;
    },

    set selectedExtension(extension)
    {
        if (this._selectedExtension === extension)
            return;

        if (this._selectedExtension) {
            this._selectedExtension.sidebarElement.classList.remove("selected");
            this._selectedExtension.sidebarElement.setAttribute("aria-selected", "false");
        }

        this._selectedExtension = extension;

        if (!this._selectedExtension) {
            document.getElementById("extensionInfo").classList.add("hidden");
            return;
        }

        ExtensionsPreferencesViewController.setSelectedExtension(this._selectedExtension.identifier);

        this._selectedExtension.sidebarElement.classList.add("selected");
        this._selectedExtension.sidebarElement.setAttribute("aria-selected", "true");

        this._selectedExtension.sidebarElement.scrollIntoViewIfNeeded(true);
        this._selectedExtension.display();

        document.getElementById("extensionInfo").classList.remove("hidden");
    },

    numberOfDeveloperSignedExtensionsInstalled: function()
    {
        return this.extensions.reduce(function(numberOfDeveloperSignedExtensions, extension) {
            return numberOfDeveloperSignedExtensions + (extension.isSignedByApple ? 0 : 1);
        }, 0);
    },
}
