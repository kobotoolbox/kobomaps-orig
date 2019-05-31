// Define the overlay, derived from google.maps.OverlayView
function Label(map, position, areaName) {
    // Initialization
    this.position_ = position;
    this.areaName_ = areaName;
    this.areaValue = null;

    this.figurediv_ = null;
    this.areaValuediv_ = null;

    this.setMap(map);
}

Label.prototype = new google.maps.OverlayView();

// Implement onAdd
Label.prototype.onAdd = function () {
    const labelDiv = document.createElement('div');
    labelDiv.setAttribute("class", "countylabel");

    const div = document.createElement('div');
    div.appendChild(labelDiv);
    div.style.position = 'absolute';
    div.style.display = 'none';

    const areaValueDiv = document.createElement('div');
    areaValueDiv.setAttribute('class', 'areaVal');
    labelDiv.appendChild(areaValueDiv);

    const areaNameNode = document.createTextNode(this.areaName_);
    labelDiv.appendChild(areaNameNode);

    const pane = this.getPanes().overlayLayer;
    pane.appendChild(div);
    this.figurediv_ = div;
    this.areaValuediv_ = areaValueDiv;

    // Ensures the label is redrawn if the text or position is changed.
    this.areaValue_changed_listener = google.maps.event.addListener(this, 'areavalue_changed',this.draw.bind(this));
};

// Implement onRemove
Label.prototype.onRemove = function () {
    this.figurediv_.parentNode.removeChild(this.figurediv);
    this.figurediv_ = null;
    // Label is removed from the map, stop updating its position/text.
    this.areaValue_changed_listener.remove()
};

// Implement draw
Label.prototype.draw = function () {
    const projection = this.getProjection();

    const position = projection.fromLatLngToDivPixel(this.position_);

    const div = this.figurediv_;
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    div.style.display = 'block';

    this.areaValuediv_.innerText = this.areaValue;
};

