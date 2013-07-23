appAPI = ({
    JSON: {},
    debug: (function () {}),
    installer: {
        getParams: (function () {}),
        getUnixTime: (function () {}),
        getIsFirstInstall: (function () {}),
        getInstallerVersion: (function () {}),
        getIds: (function () {}),
        getUserId: (function () {}),
        getInstalledSoftware: (function () {})
    },
    time: {
        now: (function () {}),
        secondsFromNow: (function () {}),
        secondsAgo: (function () {}),
        minutesFromNow: (function () {}),
        minutesAgo: (function () {}),
        hoursFromNow: (function () {}),
        hoursAgo: (function () {}),
        daysFromNow: (function () {}),
        daysAgo: (function () {}),
        yearsFromNow: (function () {}),
        yearsAgo: (function () {})
    },
    analytics: {
        trackUrl: (function () {}),
        trackEvent: (function () {}),
        settings: {
            account: null,
            domain: null
        }
    },
    utils: {
        isObject: (function () {}),
        isNumber: (function () {}),
        isString: (function () {}),
        isArray: (function () {}),
        isBoolean: (function () {}),
        isFunction: (function () {}),
        isDefined: (function () {})
    },
    browser: {
        name: null,
        version: null,
        versionNumber: null,
        realVersion: null,
        realVersionNumber: null
    },
    os: {
        name: null,
        version: null,
        versionNumber: null
    },
    selectedText: (function () {}),
    dom: {
        isIframe: (function () {}),
        addInlineCSS: (function () {}),
        addRemoteCSS: (function () {}),
        addInlineJS: (function () {}),
        addRemoteJS: (function () {}),
        callPageFunction: (function () {})
    },
    matchPages: (function () {}),
    shortcut: {
        all_shortcuts: {},
        add: (function () {}),
        remove: (function () {})
    },
    isBackground: null,
    appID: null,
    version: null,
    platform: null,
    cr_version: null,
    setTargetIframe: (function () {}),
    openURL: (function () {}),
    innerOpenURL: (function () {}),
    dns: {
        resolveIP: (function () {})
    },
    getTabId: (function () {}),
    getCrossriderID: (function () {}),
    isDebugMode: (function () {}),
    superAlert: (function () {}),
    message: {
        _MessageObject: {
            listenOrigin: (function () {}),
            removeListenerOrigin: (function () {}),
            toActiveTab: (function () {}),
            toCurrentTabWindow: (function () {}),
            toCurrentTabIframes: (function () {}),
            toAllTabs: (function () {}),
            toAllOtherTabs: (function () {}),
            toBackground: (function () {}),
            toPopup: (function () {})
        },
        addListener: (function () {}),
        removeListener: (function () {}),
        toActiveTab: (function () {}),
        toAllOtherTabs: (function () {}),
        toAllTabs: (function () {}),
        toBackground: (function () {}),
        toCurrentTabIframes: (function () {}),
        toCurrentTabWindow: (function () {}),
        toPopup: (function () {})
    },
    request: {
        get: (function () {}),
        post: (function () {}),
        getBinary: (function () {}),
        sync: {
            get: (function () {}),
            post: (function () {})
        }
    },
    db: {
        set: (function () {}),
        get: (function () {}),
        list: (function () {}),
        getList: (function () {}),
        getKeys: (function () {}),
        getExpiration: (function () {}),
        updateExpiration: (function () {}),
        removeExpired: (function () {}),
        remove: (function () {}),
        removeAll: (function () {}),
        setFromRemote: (function () {}),
        async: {
            set: (function () {}),
            get: (function () {}),
            list: (function () {}),
            getList: (function () {}),
            getKeys: (function () {}),
            getExpiration: (function () {}),
            updateExpiration: (function () {}),
            removeExpired: (function () {}),
            remove: (function () {}),
            removeAll: (function () {}),
            setFromRemote: (function () {})
        }
    },
    internal: {
        db: {
            set: (function () {}),
            get: (function () {}),
            list: (function () {}),
            getList: (function () {}),
            getKeys: (function () {}),
            getExpiration: (function () {}),
            updateExpiration: (function () {}),
            removeExpired: (function () {}),
            remove: (function () {}),
            removeAll: (function () {}),
            setFromRemote: (function () {}),
            async: {
                set: (function () {}),
                get: (function () {}),
                list: (function () {}),
                getList: (function () {}),
                getKeys: (function () {}),
                getExpiration: (function () {}),
                updateExpiration: (function () {}),
                removeExpired: (function () {}),
                remove: (function () {}),
                removeAll: (function () {}),
                setFromRemote: (function () {})
            }
        },
        reloadBackground: (function () {}),
        forceUpdate: (function () {}),
        file: {
            get: (function () {})
        },
        debug: {
            turnOn: (function () {}),
            turnOff: (function () {}),
            isDebugMode: (function () {}),
            getDebugUrl: (function () {})
        },
        installer: {
            version: null,
            isFirstInstall: null,
            installerIdentifiers: {
                installer_bic: null,
                installer_verifier: null
            },
            installerParams: {
                source_id: null,
                sub_id: null,
                uzid: null
            }
        },
        manifest: {},
        userCode: null,
        plugins: null,
        initBaseCrossriderJQueryPlugins: (function () {}),
        omniCommands: {}
    },
    appInfo: {
        id: null,
        platformVersion: null,
        userId: null,
        environment: null
    },
    __should_activate_validation__: null,
    _cr_config: {
        appID: (function () {}),
        sidebar: {
            base: {
                production: null,
                staging: null
            },
            css: null,
            themes: null
        },
        notifications_manager: {
            base: {
                production: null,
                staging: null
            },
            statsBase: {
                production: null,
                staging: null
            },
            geolocation: null,
            meta: null,
            messages: null,
            logger: null,
            loggerAPI: null
        },
        notifications: {
            base: {
                production: null,
                staging: null
            },
            css: null,
            themes: null
        },
        debug_app: {
            debug_page: {
                0: null,
                1: null
            }
        },
        resources: {
            jQuery: {
                url: null,
                cacheTime: null
            },
            jQueryUI: {
                url: null,
                theme: null,
                cacheTime: null
            },
            base: {
                production: null,
                staging: null
            },
            update: null
        }
    },
    JSONParser: {
        stringify: (function () {}),
        parse: (function () {})
    },
    isMatchPages: (function () {}),
    debugManager: {
        init: (function () {}),
        isDebug: (function () {}),
        getResourcesPath: (function () {}),
        constructor: (function () {})
    },
    queueManager: {
        queue: {
            0: {
                done: (function () {}),
                fail: (function () {}),
                progress: (function () {}),
                state: (function () {}),
                isResolved: (function () {}),
                isRejected: (function () {}),
                then: (function () {}),
                always: (function () {}),
                pipe: (function () {}),
                promise: (function () {})
            }
        },
        register: (function () {})
    },
    ready: (function () {}),
    resources: {
        init: (function () {}),
        get: (function () {}),
        getRemote: (function () {}),
        getImage: (function () {}),
        parseIncludeJS: (function () {}),
        includeCSS: (function () {}),
        addInlineJS: (function () {}),
        parseTemplate: (function () {}),
        createImage: (function () {}),
        getJQuery: (function () {}),
        getJQueryUI: (function () {}),
        getFolderContent: (function () {}),
        requestReload: (function () {}),
        openURL: (function () {}),
        constructor: (function () {})
    },
    initializerPlugin: {
        init: (function () {}),
        isReady: (function () {}),
        constructor: (function () {})
    }
})