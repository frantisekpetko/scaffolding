import {useEffect, useState} from "react";

export const MODE = {
    // NOTE:  The class names are to be used throughout the code
    //   and matched against.
    //
    //   Be careful when writing them in style selectors!
    //
    WIDE: {
        class:       "w_1168",
        max_page_width: 1168,
        thresh: 1200,
    },
    LG: {
        class:       "w_976",
        max_page_width: 976,
        thresh: 990,
    },
    MD: {
        class:       "w_748",
        max_page_width: 748,
        thresh: 768,
    },
    SM: {
        class:       "w_mob",
        max_page_width: 0,
        thresh: 0,
    },
}

function calc(arg: {innerWidth: number}) {
    const w = arg.innerWidth

    if (w >= MODE.WIDE.thresh)
        return MODE.WIDE
    else if (w >= MODE.LG.thresh)
        return MODE.LG
    else if (w >= MODE.MD.thresh)
        return MODE.MD
    else
        return MODE.SM
}
type Mode = ReturnType<typeof calc>

export const useLayout = (() => {

    const [state, setState] = useState(MODE.LG);
    //const [width, setWidth] = useState(window.innerWidth);


    useEffect(() => {
        //const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", () => calculateWidth( {innerWidth: window.innerWidth}));
        return () => window.removeEventListener("resize", () =>  calculateWidth({innerWidth: window.innerWidth}));
    }, []);

    const calculateWidth = (arg: {innerWidth: number}) => {
        const mode = calc(arg)
        if (mode != state) {
            setState(mode)
        }
        //return mode
    };


    return {
        state
    }
})