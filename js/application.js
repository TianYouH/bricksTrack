// 常量
var NUMBER_OF_COLUMNS = 10,
    NUMBER_OF_ROWS = 15,
    BRICK_SIZE = 30;

// 网格变量
var gridWidth = NUMBER_OF_COLUMNS * BRICK_SIZE,
    gridHeight = NUMBER_OF_ROWS * BRICK_SIZE;

// canvas变量
var canvas,
    context,
    canvasWidth = gridWidth + 1,
    canvasHeight = gridHeight + 1;

// 应用变量
var store = null,
    grid = null,
    selectedBrickClass = null,
    currentButton = null;


    function clearCanvas() {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;  
    }

    function draw() {
        clearCanvas();
        context.translate(0.5, 0.5);
        grid.draw(context);
    }

    function creatBrickAt(column,row) {
        if (!selectedBrickClass) {
            return;
        }
        var brick = new selectedBrickClass();
        brick.column = column;
        brick.row = row;

        grid.addBrick(brick,context);
    }

    function onGridClicked(event) {
        var mouseX = event.offsetX || event.layerX,
            mouseY = event.offsetY || event.layerY;

        var column = Math.floor(mouseX / BRICK_SIZE),
            row = Math.floor(mouseY / BRICK_SIZE);
        
        var selectedBrick = grid.getBrickAt(column,row);
        if (selectedBrick) {
            selectedBrick.rotation +=90;
            draw();
        }else{
            creatBrickAt(column,row);
        }
    }

    function setBrick(buttonID) {
        if (currentButton) {
            currentButton.removeAttr("disabled");
        }

        currentButton = $("#"+buttonID);
        currentButton.attr("disabled","disabled");

        switch (buttonID) {
            case "square-brick":
                selectedBrickClass = Square;
                break;
            case "triangle-brick":
                selectedBrickClass = Triangle;
                break;
            case "circle-brick":
                selectedBrickClass = Circle;
                break;
            case "curve-brick":
                selectedBrickClass = Curve;
                break;
        
            default:
                break;
        }
    }

    function loadTrack(ID) {
        grid.bricks = store.getTrack(ID);

        draw();
    }

    function addTrackToList(ID,name) {
        var entry = $("<p>");
        var link = $("<a href=''>Load</a>");

        link.click(function (event) {
            event.preventDefault();
            loadTrack(ID);
        })

        entry.append(link).append("-" + name);
        $("#tracks-container").append(entry);
    }

    function initUI() {
        $(canvas).click(onGridClicked);
        $("#bricks-container button").click(function (event) {
            event.preventDefault();
            var id = $(this).attr("id");
            setBrick(id);
        })
        $("#clear-track").click(function (event) {
            event.preventDefault();
            grid.clear();
            draw();
        })
        $("#save-track").click(function (event) {
            event.preventDefault();

            var trackID = store.saveTrack(grid.bricks);
            var trackName = $("#track-name").val();

            addTrackToList(trackID, trackName);
        })
    }

    $(document).ready(function () {
        canvas = document.getElementById("grid");
        context = canvas.getContext("2d");

        grid = new Grid(gridWidth, gridHeight, BRICK_SIZE);
        store = new Store();

        initUI();
        draw();
    })
