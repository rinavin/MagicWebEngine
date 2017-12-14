@echo === Magic Engine Build Utility ===

@echo [Removing existing dist folders....]
@call rimraf dist
@call rimraf node_modules/@magic


@FOR %%N IN (testlib) DO (

    echo [Building %%N...]
    echo [Pushing npm version...]
    call cd src/%%N
    call npm version patch
    cd ../../
    call webpack --config src/%%N/webpack.config.js
    echo [Done Building %%N...]

    echo [Copying %%N to local node_modules...]
    cpx ./dist/@magic/%%N/** ./node_modules/@magic/%%N -C
    echo [Done Copying %%N.]
    echo [Publishing to NPM...]
    cd dist/@magic/%%N
    call npm publish
    cd ../../../
)

@echo [Build done.]