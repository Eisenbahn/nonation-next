module.exports = {
    images: {
      domains: ['imgur.com', 's3.amazonaws.com', 'cravatar.eu', 'images.minemarket.com.br', 'i.imgur.com'],
    },
    webpack: (config, options) => {
        config.module.rules[config.module.rules.length - 1]?.oneOf.forEach((moduleLoader, i) => {
            Array.isArray(moduleLoader.use) &&
                moduleLoader.use.forEach((l) => {
                if (l.loader.includes('css-loader') && !l.loader.includes('postcss-loader')) {
                    delete l.options.modules.getLocalIdent;
                    l.options.modules = {
                        ...l.options.modules,
                        localIdentName: '[hash:base64:5]',
                    }
                }
            })
        })

        return config;
    }
}