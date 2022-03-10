
function Overlay(shadowRoot, title, subtitle, alwaysVisible)
{
    this.populate(shadowRoot, title, subtitle, alwaysVisible);
};

Overlay.prototype = {

    populate: function(shadowRoot, titleText, subtitleText, alwaysVisible)
    {
        // Generate the following structure:
        //
        // <div pseudo="-webkit-snapshotted-plugin-content">
        //     <div class="snapshot-overlay" aria-label="[Title]: [Subtitle]" role="button">
        //         <div class="snapshot-blur"></div>
        //         <div class="snapshot-box"></div>
        //             <div class="snapshot-icon"></div>
        //             <div class="snapshot-label">
        //                 <div class="snapshot-title">[Title]</div>
        //                 <div class="snapshot-subtitle">[Subtitle]</div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        var shadowContainer = this.shadowContainer = document.createElement("div");
        shadowContainer.setAttribute("pseudo", "-webkit-snapshotted-plugin-content");
        shadowContainer.setAttribute("dir", "auto");

        var overlay = shadowContainer.appendChild(document.createElement("div"));
        overlay.setAttribute("aria-label", titleText + ": " + subtitleText);
        overlay.setAttribute("role", "button");
        overlay.className = "snapshot-overlay";
        if (alwaysVisible)
            overlay.classList.add("snapshot-overlay-always-visible");

        var blur = overlay.appendChild(document.createElement("div"));
        blur.className = "snapshot-blur";

        var box = overlay.appendChild(document.createElement("div"));
        box.className = "snapshot-box";

        var icon = box.appendChild(document.createElement("div"));
        icon.className = "snapshot-icon";

        var snapshotLabel = box.appendChild(document.createElement("div"));
        snapshotLabel.className = "snapshot-label";

        var title = this.title = snapshotLabel.appendChild(document.createElement("div"));
        title.className = "snapshot-title";
        title.textContent = titleText;

        var subtitle = this.subtitle = snapshotLabel.appendChild(document.createElement("div"));
        subtitle.className = "snapshot-subtitle";
        subtitle.textContent = subtitleText;

        shadowRoot.addEventListener("resize", this, false);

        shadowRoot.appendChild(shadowContainer);
    },

    handleEvent: function(event)
    {
        this.updateLayout();
    },

    measureLabels: function()
    {
        this.titleWidth = Math.ceil(this.title.getBoundingClientRect().width);
        this.subtitleWidth = Math.ceil(this.subtitle.getBoundingClientRect().width);
    },

    updateLayout: function()
    {
        if (!this.shadowContainer || !this.title || !this.subtitle)
            this.populate();

        if (!this.titleWidth || !this.subtitleWidth)
            this.measureLabels();

        // These metrics need to be kept in sync with PlugInsExtra.css.
        const minDimension = 37;
        const shortIconMargin = 12;
        const margin = 17;
        const padding = 3;

        var metrics = this.shadowContainer.getBoundingClientRect();
        var width = metrics.width - padding * 2;
        var height = metrics.height - padding * 2;

        // We can't even fit the icon, don't show the overlay.
        if (width - minDimension < 0 || height - minDimension < 0)
            this.shadowContainer.className = "no-overlay";
        // We can't fit the icon and the labels even on several lines, show only the icon.
        else if (width - minDimension - shortIconMargin - Math.max(this.titleWidth, this.subtitleWidth) < 0)
            this.shadowContainer.className = "icon-only";
        // We can't fit the icon and the labels on a single row, show on two lines.
        else if (width - minDimension - margin - this.titleWidth - margin - this.subtitleWidth < 0)
            this.shadowContainer.className = "two-lines";
        // Everything fits, use the default layout.
        else
            this.shadowContainer.removeAttribute("class");
    }

};

// Function called from WebCore.
function createOverlay(shadowRoot, title, subtitle, alwaysVisible)
{
    new Overlay(shadowRoot, title, subtitle, alwaysVisible);
};
