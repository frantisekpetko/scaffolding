type Logger_t = {
    prefix: string
    enabled(): boolean

    enable(val: boolean): Logger_t
    force_stacktraces(val: boolean): Logger_t

    log  (...a: any[]): void
    warn (...a: any[]): void
    error(...a: any[]): void
}


export const Logger = (
    prefix: string,
    arg: {
        enabled: boolean,
        parent?: Logger_t,
    }
): Logger_t => {
    const optional_parent = arg.parent

    if ( !prefix.endsWith(" ") ) { // Always end prefixes with a space
        prefix = prefix + " "
    }
    if ( !!optional_parent ) {
        prefix = `${optional_parent.prefix}| ${prefix}` // ...they end with a space
    }

    let _forced_warn: boolean = false
    let _enabled:     boolean = arg.enabled
    function is_enabled(): boolean {
        if ( !!optional_parent )
            return _enabled && optional_parent.enabled()
        else
            return _enabled
    }

    return {

        prefix,

        // Toggling and getting is kinda weird, but using TS classes is weirder
        // when wrapping window.console like this. Just deal with it.

        enabled: is_enabled, // TODO:  apply the alias
        enable( val: boolean ):Logger_t   { _enabled = val;     return this },
        force_stacktraces( val: boolean ) { _forced_warn = val; return this },

        // But these are augmented with our own extended meaning...
        log: (...a:any[])=>{
            if (!is_enabled()) return
            if (_forced_warn) {
                console.warn(prefix, ...a)
            } else {
                console.log(prefix, ...a)
            }
        },
        warn: (...a:any[])=>{
            if (!is_enabled()) return
            console.warn(prefix, ...a)
        },
        error: (...a:any[])=>{
            // Errors always go through!!  //if (!enabled()) return
            console.error(prefix, ...a)
        },
    }
}