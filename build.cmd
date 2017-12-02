@echo off
@echo [Removing existing dist folders....]
@call rimraf dist
@call rimraf node_modules/@magic


@FOR %%N IN (mscorelib, utils, gui, engine, httpClient) DO (
    @echo [Building %%N...]
    @call webpack --config src/%%N/webpack.config.js
    @echo [Done Building %%N...]

    @echo [Copying %%N to node_modules...]
    @cpx ./dist/@magic/%%N/*.* ./node_modules/@magic/%%N -v
    @echo [Done Copying %%N...]
)

@echo [Build done.]