import React, { MouseEvent, MouseEventHandler } from "react"
import { HeartIcon } from "@heroicons/react/24/outline"

export type LikeProps = {
    liked: boolean
    onLike: Function
}

export default function Like({ liked, onLike }: LikeProps) {
    return (
        <>
            <HeartIcon
                fill={liked ? "black" : "none"}
                className="cursor-pointer"
                width={20}
                onClick={() => onLike()}
            />
        </>
    )
}
