import PlayerComponent from "./PlayerComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JoystickComponent extends cc.Component {
  @property(PlayerComponent)
  player: PlayerComponent = null;

  @property(cc.Node)
  joystickBackground: cc.Node = null;

  @property(cc.Node)
  joystickKnob: cc.Node = null;

  private _stickPos: cc.Vec2 = cc.v2(0, 0);
  private _touchId: number = -1;
  private maxRadialDist: number = 130;
  onLoad() {
    this.initJoystick();
  }

  initJoystick() {
    // Set up touch event listeners for joystick
    this.joystickBackground.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.joystickBackground.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.joystickBackground.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.joystickBackground.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  onTouchStart(event: cc.Event.EventTouch) {
    // Get the position of the touch relative to the joystick background
    this._stickPos = this.joystickBackground.convertToNodeSpaceAR(event.getLocation());
    this._touchId = event.getID();
  }

  onTouchMove(event: cc.Event.EventTouch) {
    if (event.getID() === this._touchId) {
      const stickPos = this.joystickBackground.convertToNodeSpaceAR(event.getLocation());
      const radialDistance = stickPos.mag();
      this._stickPos = this.joystickBackground.convertToNodeSpaceAR(event.getLocation());

      if (radialDistance > this.maxRadialDist) {
        const theta = Math.atan2(stickPos.y, stickPos.x);
        const newStickPos: cc.Vec2 = new cc.Vec2(this.maxRadialDist * Math.cos(theta), this.maxRadialDist * Math.sin(theta));
        this._stickPos = newStickPos;
      }
    }
  }

  onTouchEnd(event: cc.Event.EventTouch) {
    if (event.getID() === this._touchId) {
      this._stickPos = cc.v2(0, 0);
      this._touchId = -1;
    }
  }

  update(dt: number) {
    const distance = this._stickPos.mag();
    const maxDistance = this.joystickBackground.width * 0.5;

    let angle = this._stickPos.signAngle(cc.v2(1, 0));
    let ratio = distance / maxDistance;
    ratio = ratio > 1 ? 1 : ratio;

    this.joystickKnob.setPosition(this._stickPos);
    if (this._touchId != -1) {
      if (this.node.name == "left") this.player.move(this._stickPos);
      else this.player.rotate(this._stickPos.normalize());
    }
  }
}
