/**
 * 画布信息类型
 */
export type CanvasInfoType = {
  controlsTree: ControlType,
  local_mouse_x: number,
  local_mouse_y: number,
  canvas_mouse_x:number,
  canvas_mouse_y:number,
  rect: DOMRect
}

/**
 * 渲染完成的控件位置
 */
export type ControlPosition = {
  x: number,
  y: number,
  control: ControlType,
}

/**
 * 内部控件类型
 */
export type ControlType = {
  id: string,
  type: ControlEnum,
  x,
  y,
  text?: string,
  style?: CStyle,
  parent: ControlType
  children?: ControlType[]
}

export enum ControlEnum {
  "box",
  "button"
}

/**
 * ControlStyle 控件样式
 */
export type CStyle = {
  /**宽度 */
  width?: number,
  /**高度 */
  height?: number,
  /**背景 */
  background?: string,
  /**颜色 */
  color?: string,
  /**字体大小 */
  size?: number,
  /**外边距 */
  margin?: string,
  /**内边距 */
  padding?: string,
  /**边框 */
  border?: CBorderStyle,
  /**悬停 */
  hover?: string,
  /**按下 */
  press?: string
}

/**
 * ControlInteractionStyle 控件交互样式
 */
export type CIStyle = {
  background?: string
}

/**
 * 边框类型枚举
 */
export enum CBorderEnum {
  "solid"
}

/**控件边框样式 */
export type CBorderStyle = {
  size: number,
  type: CBorderEnum,
  color: string
}

/**对齐 */
export type AlignEnum = {
  "top",
  "right",
  "bottom",
  "left",
}
