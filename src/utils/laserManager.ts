export interface Laser {
    id: number;
    x: number;
    z: number;
    hit: boolean;
    active: boolean;
}

class FastLaserManager {
    public lasers: Laser[] = [];

    fire(x: number) {
        this.lasers.push({
            id: Date.now() + Math.random(),
            x,
            z: 0,
            hit: false,
            active: true
        });
    }

    update(delta: number) {
        for (let i = 0; i < this.lasers.length; i++) {
            this.lasers[i].z -= 60 * delta; // LASER_SPEED = 60
            if (this.lasers[i].z < -100) {
                this.lasers[i].active = false;
            }
        }
        this.lasers = this.lasers.filter(l => l.active && !l.hit);
    }

    checkCollision(obs: { x: number, z: number, width: number }): boolean {
        for (let i = 0; i < this.lasers.length; i++) {
            const l = this.lasers[i];
            if (!l.hit && Math.abs(obs.x - l.x) < (obs.width / 2 + 1.5) && Math.abs(obs.z - l.z) < 5.0) {
                l.hit = true;
                return true;
            }
        }
        return false;
    }

    clear() {
        this.lasers = [];
    }
}

export const laserManager = new FastLaserManager();
