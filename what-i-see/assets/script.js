$(document).ready(function() {
    const follower = $("#follower");
    const canvas = $("#canvas");
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const blendModes = [
        'blend-soft-light',
        'blend-exclusion',
        'blend-difference',
        'blend-overlay'
    ];

    function generateRandomPath(startX, startY, segmentLength = 10) { // Reduced from 15 to 10
        let path = `M ${startX} ${startY}`;
        let x = startX;
        let y = startY;
        let angle = Math.random() * 2 * Math.PI;
        const segments = Math.floor(Math.random() * 3) + 3; // 3-5 segments

        for (let i = 0; i < segments; i++) {
            angle += (Math.random() - 0.2) * Math.PI / 1.2; // Wider angle variation
            let dx = Math.cos(angle) * segmentLength;
            let dy = Math.sin(angle) * segmentLength;
            let cx = x + dx * 0.5;
            let cy = y + dy * 0.5;
            x += dx;
            y += dy;
            path += ` Q ${cx} ${cy}, ${x} ${y}`;
        }

        return path;
    }

    function createDottedStripes(fade = false) {
        if (fade) {
            // Fade out current stripes
            canvas.stop(true).animate({ opacity: 0 }, 600, function() {
                drawNewStripes();
                canvas.animate({ opacity: 1 }, 600);
            });
        } else {
            drawNewStripes();
            canvas.css({ opacity: 1 });
        }

        function drawNewStripes() {
            canvas.empty();
            const stripeCount = Math.floor(Math.random() * 6) + 4; // 4-9 stripes

            canvas.attr({
                'width': '1000',
                'height': '1000',
                'viewBox': '0 0 1000 1000',
                'preserveAspectRatio': 'none'
            });

            for (let i = 0; i < stripeCount; i++) {
                // Stripe style (same for all dots in this stripe)
                const isWhite = Math.random() > 0.5;
                const hasBorder = Math.random() > 0.5;
                const radius = Math.round(Math.random() * 2 + 2); // 2-4 px
                const blur = (Math.random() * 3 + 4).toFixed(1); // 4-7px blur

                let fill, stroke, strokeWidth;
                if (isWhite) {
                    fill = 'white';
                    stroke = hasBorder ? 'black' : 'none';
                    strokeWidth = hasBorder ? 1 : 0;
                } else {
                    fill = 'black';
                    stroke = hasBorder ? 'white' : 'none';
                    strokeWidth = hasBorder ? 1 : 0;
                }

                // Stripe path parameters
                const dotCount = Math.floor(Math.random() * 6) + 6; // 6-11 dots per stripe
                const step = radius * 1.6; // dots close to each other
                let x = Math.random() * 800 + 100;
                let y = Math.random() * 800 + 100;
                let angle = Math.random() * 2 * Math.PI;

                // Store previous dot positions for overlap detection (only last 4 for speed)
                const dotPositions = [];

                for (let j = 0; j < dotCount; j++) {
                    // Allow sharp turns: angle can change up to ±90°
                    angle += (Math.random() - 0.5) * Math.PI;

                    // Compute next position
                    x += Math.cos(angle) * step;
                    y += Math.sin(angle) * step;

                    // Only check overlap with last 4 dots for speed
                    let overlap = false;
                    for (let k = Math.max(0, dotPositions.length - 4); k < dotPositions.length; k++) {
                        const dx = x - dotPositions[k].x;
                        const dy = y - dotPositions[k].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < radius * 1.1) {
                            overlap = true;
                            break;
                        }
                    }
                    dotPositions.push({ x, y });

                    // If overlapping, hide border
                    let thisStroke = overlap ? 'none' : stroke;
                    let thisStrokeWidth = overlap ? 0 : strokeWidth;

                    $(document.createElementNS("http://www.w3.org/2000/svg", "circle"))
                        .attr({
                            cx: Math.round(x),
                            cy: Math.round(y),
                            r: radius,
                            fill: fill,
                            stroke: thisStroke,
                            'stroke-width': thisStrokeWidth,
                            opacity: 0.18,
                            filter: `blur(${blur}px)`
                        })
                        .appendTo(canvas);
                }
            }
        }
    }

    // Add slideshow functionality
    function setupSlideshow() {
        const images = $('.images-container img');
        let currentIndex = 0;

        // Preload all images
        let loadedCount = 0;
        images.each(function() {
            const img = new window.Image();
            img.onload = function() {
                loadedCount++;
                if (loadedCount === images.length) {
                    startSlideshow();
                }
            };
            img.onerror = function() {
                loadedCount++;
                if (loadedCount === images.length) {
                    startSlideshow();
                }
            };
            img.src = $(this).attr('src');
        });

        function startSlideshow() {
            images.eq(0).addClass('active');
            setInterval(() => {
                images.eq(currentIndex).removeClass('active');
                currentIndex = (currentIndex + 1) % images.length;
                images.eq(currentIndex).addClass('active');
            }, 8000);
        }
    }

    let isFrozen = false;
    let isShiftPressed = false;

    $(document).keydown(function(e) {
        if (e.key === 'Shift') isShiftPressed = true;
        if (e.key === ' ' && isShiftPressed) {
            isFrozen = !isFrozen;
            if (!isFrozen) createDottedStripes();
        }
    });

    $(document).keyup(function(e) {
        if (e.key === 'Shift') isShiftPressed = false;
    });

    $(document).mousemove(function(e) {
        mouseX = e.pageX - (window.innerWidth / 2);
        mouseY = e.pageY - (window.innerHeight / 2);
    });

    function updateFollower() {
        if (!isFrozen) {
            followerX += (mouseX - followerX) * 0.2;
            followerY += (mouseY - followerY) * 0.2;

            follower.css({
                transform: `translate(calc(-50% + ${followerX}px), calc(-50% + ${followerY}px))`
            });
        }
        requestAnimationFrame(updateFollower);
    }

    createDottedStripes();

    setupSlideshow();
    updateFollower();

    // Recalculate and redraw stripes every 14.5 seconds with fade transition
    setInterval(() => {
        if (!isFrozen) createDottedStripes(true);
    }, 14500);
});
