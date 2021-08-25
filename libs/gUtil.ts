//
import _forEach from 'lodash/forEach';

import {IPolylineShape, IRectShape} from "./feature/gInterface";
import {IObject, IPoint} from "./gInterface";

export default class Util {
    static MathUtil: any = {
        // 获取亮点之间的中心点
        getMiddlePoint(start: IPoint, end: IPoint): IPoint {
            const {x: x1, y: y1} = start;
            const {x: x2, y: y2} = end;
            const middleX = (x1 + x2) / 2;
            const middleY = (y1 + y2) / 2;
            return {x: middleX, y: middleY};
        },
        // 计算两端之间的距离
        distance(start: IPoint, end: IPoint): number {
            const {x: x1, y: y1} = start;
            const {x: x2, y: y2} = end;
            const dltX = x1 - x2;
            const dltY = y1 - y2;
            return Math.sqrt(dltX * dltX + dltY * dltY);
        },
        // 计算两端之间的距离
        pointInPolygon(point: IPoint, polygon: IPoint[]) {
            const {x, y} = point;
            for (var c = false, i = -1, l = polygon.length, j = l - 1; ++i < l; j = i) {
                const {x: xi, y: yi} = polygon[i];
                const {x: xj, y: yj} = polygon[j];
                ((yi <= y && y < yj) || (yj <= y && y < yi))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
                && (c = !c);
            }
            return c;
        },
        pointInRect(point: IPoint, rect: IRectShape) {
            const {x, y} = point;
            const {x: startX, y: startY, width, height} = rect;
            const endX = startX + width;
            const endY = startY - height;
            return x >= startX && x <= endX && y >= endY && y <= startY;
        },
        pointInPoint(point: IPoint, point2: IRectShape, option: IObject = {}) {
            const {tolerance} = option;
            const distance = Util.MathUtil.distance(point, point2);
            return distance <= tolerance;
        },
        pointInPolyline(pt: IPoint, points: IPoint[], option: IObject = {}) {
            const {tolerance} = option;
            const maxIndex = points.length - 1;
            let result = false;
            _forEach(points, (point: IPoint, index: number) => {
                if (index === maxIndex) {
                    return;
                }
                const nextPoint = points[index + 1];
                const distance = Util.MathUtil.distancePoint2Line(pt, point, nextPoint);
                if (distance <= tolerance) {
                    result = true;
                    return false;
                }
            });
            return result;
        },
        // 计算点到线段的最短距离
        distancePoint2Line(pt: IPoint, point1: IPoint, point2: IPoint) {
            const {x, y} = pt;
            const {x: x1, y: y1} = point1;
            const {x: x2, y: y2} = point2;

            const A = x - x1;
            const B = y - y1;
            const C = x2 - x1;
            const D = y2 - y1;

            const dot = A * C + B * D;
            const lineLength = C * C + D * D;
            let param = -1;
            if (lineLength !== 0) { // 线段长度不能为0
                param = dot / lineLength;
            }

            let xx: number;
            let yy: number;
            if (param < 0) {
                xx = x1;
                yy = y1;
            }
            else if (param > 1) {
                xx = x2;
                yy = y2;
            }
            else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }

            const dx = x - xx;
            const dy = y - yy;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    // 事件相关util
    static EventUtil: any = {
        // 获取鼠标左右键
        getButtonIndex(event: MouseEvent): number {
            if (!+ [1,]) {
                switch (event.button) {
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4:
                        return 1;
                }
            }
            return event.button;
        }
    }
}
