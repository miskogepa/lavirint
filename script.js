document.addEventListener("DOMContentLoaded", () => {
    const gridItems = document.querySelectorAll(".grid-item");
    let squareIndices = [];
    let circleIndices = [];
    let pathStarted = false;
    let pathCompleted = false;
    let previousSquareIndices = [];

    function getRandomIndices(count, exclude = [], minDistance = 0) {
        const indices = [];
        while (indices.length < count) {
            const index = Math.floor(Math.random() * gridItems.length);
            if (!indices.includes(index) && !exclude.includes(index) && isFarEnough(index, indices, minDistance)) {
                indices.push(index);
            }
        }
        return indices;
    }

    function isFarEnough(index, indices, minDistance) {
        return indices.every(i => Math.abs(i - index) >= minDistance);
    }

    function showSquares() {
        squareIndices = getRandomIndices(4);
        squareIndices.forEach(index => {
            gridItems[index].classList.add("square");
        });
        setTimeout(() => {
            squareIndices.forEach(index => {
                gridItems[index].classList.remove("square");
            });
            previousSquareIndices = [...squareIndices];
            showCircles();
        }, 10000);
    }

    function showCircles() {
        circleIndices = getRandomIndices(2, squareIndices, 2);
        circleIndices.forEach(index => {
            gridItems[index].classList.add("circle");
        });
    }

    gridItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (item.classList.contains("circle") && !pathStarted) {
                pathStarted = true;
                item.classList.add("connected");
            } else if (pathStarted && !pathCompleted) {
                if (item.classList.contains("square")) {
                    alert("Game Over! You hit a square.");
                    location.reload();
                } else if (item.classList.contains("circle")) {
                    item.classList.add("connected");
                    pathCompleted = true;
                    alert("Congratulations! You connected the circles.");
                    circleIndices.forEach(index => {
                        gridItems[index].classList.add("connected");
                    });
                } else if (previousSquareIndices.includes([...gridItems].indexOf(item))) {
                    alert("Game Over! You clicked where a square was.");
                    location.reload();
                } else {
                    item.classList.add("connected");
                }
            }
        });
    });

    showSquares();
});
