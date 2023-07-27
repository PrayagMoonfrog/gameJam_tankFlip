import BulletComponent from "./BulletComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerComponent extends cc.Component {
  @property(cc.Node)
  gun: cc.Node = null;

  @property(cc.Prefab)
  bullet: cc.Prefab = null;

  public moveSpeed: number = 0.02;
  public rotateSpeed: number = 1;

  move(dir: cc.Vec2) {
    this.node.x = this.node.x + this.moveSpeed * dir.x;
    this.node.y = this.node.y + this.moveSpeed * dir.y;
  }

  rotate(dir: cc.Vec2) {
    const thetaDeg = this.getAngle(dir);
    const rot = this.rotateSpeed * thetaDeg;
    this.gun.rotation = 450 - rot;
  }

  fire() {
    const bullet = cc.instantiate(this.bullet);
    bullet.getComponent(BulletComponent).move(cc.v2(1, 0));
  }

  getAngle(dir: cc.Vec2) {
    const angle = Math.atan2(dir.y, dir.x);
    let thetaDeg = cc.misc.radiansToDegrees(angle);
    if (thetaDeg < 0) {
      thetaDeg += 360;
    }
    return thetaDeg;
  }
  onLoad() {}
}
