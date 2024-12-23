document.addEventListener("DOMContentLoaded", () => {
    const gridItems = document.querySelectorAll(".grid-item");
    const resetButton = document.getElementById("reset");
    let squareIndices = [];
    let circleIndices = [];
    let pathStarted = false;
    let pathCompleted = false;
    let previousSquareIndices = [];
    let score = 0;
    let gameTimeout;

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
        squareIndices = getRandomIndices(5); // Change 4 to 5
        squareIndices.forEach(index => {
            gridItems[index].classList.add("square");
        });
        gameTimeout = setTimeout(() => {
            squareIndices.forEach(index => {
                gridItems[index].classList.remove("square");
            });
            previousSquareIndices = [...squareIndices];
            showCircles();
        }, 10000);
    }

    function showCircles() {
        do {
            circleIndices = getRandomIndices(2, squareIndices, 2); // Ensure minimum 2 fields between circles
        } while (!isPathConnectable(circleIndices[0], circleIndices[1]));
        circleIndices.forEach(index => {
            gridItems[index].classList.add("circle");
        });
    }

    function isPathConnectable(start, end) {
        // Implement a simple pathfinding algorithm to check if a path exists
        const queue = [start];
        const visited = new Set();
        visited.add(start);

        while (queue.length > 0) {
            const current = queue.shift();
            if (current === end) return true;

            const neighbors = getNeighbors(current);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor) && !squareIndices.includes(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return false;
    }

    function getNeighbors(index) {
        const neighbors = [];
        const rowSize = Math.sqrt(gridItems.length);

        if (index % rowSize !== 0) neighbors.push(index - 1); // left
        if (index % rowSize !== rowSize - 1) neighbors.push(index + 1); // right
        if (index >= rowSize) neighbors.push(index - rowSize); // up
        if (index < gridItems.length - rowSize) neighbors.push(index + rowSize); // down

        return neighbors;
    }

    function resetGame() {
        clearTimeout(gameTimeout); // Clear any existing timeouts
        pathStarted = false;
        pathCompleted = false;
        squareIndices = [];
        circleIndices = [];
        previousSquareIndices = [];
        gridItems.forEach(item => {
            item.classList.remove("square", "circle", "connected");
        });
        showSquares();
    }

    function increaseScore() {
        score++;
        document.getElementById("poruka").innerHTML = "vas rezultat je: " + score;
    }

    gridItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (item.classList.contains("circle") && !pathStarted) {
                pathStarted = true;
                item.classList.add("connected");
            } else if (pathStarted && !pathCompleted) {
                if (item.classList.contains("square")) {
                    alert("Game Over! You hit a square.");
                    resetGame();
                } else if (item.classList.contains("circle")) {
                    item.classList.add("connected");
                    pathCompleted = true;
                    increaseScore(); // Ensure score increases
                    alert("Congratulations! You connected the circles.");
                    setTimeout(resetGame, 1000); // Delay reset to show the score update
                } else if (previousSquareIndices.includes([...gridItems].indexOf(item))) {
                    alert("Game Over! You clicked where a square was.");
                    resetGame();
                } else {
                    item.classList.add("connected");
                }
            }
        });
    });

    resetButton.addEventListener("click", () => {
        score = 0; // Reset the score when the reset button is clicked
        document.getElementById("poruka").innerHTML = "vas rezultat je: " + score; // Update the score display
        resetGame();
    });

    resetGame(); // Ensure the game starts correctly
});

