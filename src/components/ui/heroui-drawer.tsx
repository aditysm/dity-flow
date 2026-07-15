"use client"

import "@heroui/styles/css"
import "./heroui-drawer-utils/index.css"
import { Drawer as HeroUIDrawer, useOverlayState } from "@heroui/react"

// Cast to any to bypass conflicting React-Aria/React-19 TS typings
const Drawer = HeroUIDrawer as any;

export { Drawer, useOverlayState }
export default Drawer
