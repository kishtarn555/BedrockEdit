

function plot3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): { x: number, y: number, z: number }[] {
    let response: { x: number, y: number, z: number }[] = [];
    let dx = Math.abs(x1 - x2);
    let dy = Math.abs(y1 - y2);
    let dz = Math.abs(z1 - z2);

    if (dx >= dy && dx >= dz) {
        let xy = plo2D(x1, y1, x2, y2);
        let xz = plo2D(x1, z1, x2, z2);

        return xy.map((c, i)=> {
            return {
                x:c.x,
                y:c.y,
                z:xz[i].y
            }
        });
    } else if (dy >= dx && dy >= dz) {
        let xy = plo2D(x1,y1,x2,y2);
        let yz = plo2D(y1,z1,y2,z2);
        return xy.map((c, i)=> {
            return {
                x:c.x,
                y:c.y,
                z:yz[i].y
            }
        });
    } else {
        let xz = plo2D(x1,z1,x2,z2);
        let yz = plo2D(y1,z1,y2,z2);
        return xz.map((c, i)=> {
            return {
                x:c.x,
                y:yz[i].x,
                z:c.y
            }
        });
    }
    return response;

}

function plo2D(x1: number, y1: number, x2: number, y2: number): { x: number, y: number }[] {
    let response: { x: number, y: number }[] = [];

    let dx = Math.abs(x1 - x2);
    let dy = Math.abs(y1 - y2);
    if (dx >= dy) {
        if (x1 > x2) {
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
        }
        
        let sy = y1 <= y2?1:-1;
        let y = y1;
        let D = 2*dy-dx;
        for (let x = x1; x <= x2; x++) {
            response.push({x,y});
            if (D > 0) {
                y+=sy;
                D -= 2*dx;
            }
            D += 2*dy;
        }
    } else {        
        if (y1 > y2) {
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
        }
        let sx = x1 <= x2?1:-1;
        let x = x1;
        let D = 2*dx-dy;
        for (let y = y1; y <= y2; y++) {
            response.push({x,y});
            if (D > 0) {
                x+=sx;
                D -= 2*dy;
            }
            D += 2*dx;
        }
    }
    return response;

}




export { plot3D }