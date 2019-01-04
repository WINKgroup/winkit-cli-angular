'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">winkit documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AppModule-092d3865d2aa1d2338b47c3523d686ed"' : 'data-target="#xs-components-links-module-AppModule-092d3865d2aa1d2338b47c3523d686ed"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AppModule-092d3865d2aa1d2338b47c3523d686ed"' : 'id="xs-components-links-module-AppModule-092d3865d2aa1d2338b47c3523d686ed"' }>
                                        <li class="link">
                                            <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ComponentsModule.html" data-type="entity-link">ComponentsModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ComponentsModule-402fa6920aa1045e7e0a907088a745c4"' : 'data-target="#xs-components-links-module-ComponentsModule-402fa6920aa1045e7e0a907088a745c4"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ComponentsModule-402fa6920aa1045e7e0a907088a745c4"' : 'id="xs-components-links-module-ComponentsModule-402fa6920aa1045e7e0a907088a745c4"' }>
                                        <li class="link">
                                            <a href="components/FiltersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">FiltersComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/MediaInputComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MediaInputComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/MediaModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MediaModalComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/NavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ModulesModule-5febdea62e8184747654c5b6d7dc7b17"' : 'data-target="#xs-components-links-module-ModulesModule-5febdea62e8184747654c5b6d7dc7b17"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ModulesModule-5febdea62e8184747654c5b6d7dc7b17"' : 'id="xs-components-links-module-ModulesModule-5febdea62e8184747654c5b6d7dc7b17"' }>
                                        <li class="link">
                                            <a href="components/BaseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">BaseComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/BasePageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">BasePageComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/PlatformLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">PlatformLayoutComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/PublicLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">PublicLayoutComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/GuardsModule.html" data-type="entity-link">GuardsModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/PagesModule.html" data-type="entity-link">PagesModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/PipeModule.html" data-type="entity-link">PipeModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#pipes-links-module-PipeModule-e27192830ead6502a6850f5897acc527"' : 'data-target="#xs-pipes-links-module-PipeModule-e27192830ead6502a6850f5897acc527"' }>
                                    <span class="icon ion-md-add"></span>
                                    <span>Pipes</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="pipes-links-module-PipeModule-e27192830ead6502a6850f5897acc527"' : 'id="xs-pipes-links-module-PipeModule-e27192830ead6502a6850f5897acc527"' }>
                                        <li class="link">
                                            <a href="pipes/KeysPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">KeysPipe</a>
                                        </li>
                                        <li class="link">
                                            <a href="pipes/OrderByPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrderByPipe</a>
                                        </li>
                                        <li class="link">
                                            <a href="pipes/ReversePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReversePipe</a>
                                        </li>
                                        <li class="link">
                                            <a href="pipes/SafePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafePipe</a>
                                        </li>
                                        <li class="link">
                                            <a href="pipes/WherePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WherePipe</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/PlatformModule.html" data-type="entity-link">PlatformModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-PlatformModule-e5f26308163ac2c01ac4e7b13971e1f2"' : 'data-target="#xs-components-links-module-PlatformModule-e5f26308163ac2c01ac4e7b13971e1f2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-PlatformModule-e5f26308163ac2c01ac4e7b13971e1f2"' : 'id="xs-components-links-module-PlatformModule-e5f26308163ac2c01ac4e7b13971e1f2"' }>
                                        <li class="link">
                                            <a href="components/DashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/UserDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserDetailComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/UserListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserListComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/PublicModule.html" data-type="entity-link">PublicModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-PublicModule-0e2ade888bae63770fc342c62c212e62"' : 'data-target="#xs-components-links-module-PublicModule-0e2ade888bae63770fc342c62c212e62"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-PublicModule-0e2ade888bae63770fc342c62c212e62"' : 'id="xs-components-links-module-PublicModule-0e2ade888bae63770fc342c62c212e62"' }>
                                        <li class="link">
                                            <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/PolicyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">PolicyComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RecoveryPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RecoveryPasswordComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ResetPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResetPasswordComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ServicesModule.html" data-type="entity-link">ServicesModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-ServicesModule-3be1b39e0a97a52b06d314ba0c6f84a9"' : 'data-target="#xs-injectables-links-module-ServicesModule-3be1b39e0a97a52b06d314ba0c6f84a9"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-ServicesModule-3be1b39e0a97a52b06d314ba0c6f84a9"' : 'id="xs-injectables-links-module-ServicesModule-3be1b39e0a97a52b06d314ba0c6f84a9"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GoogleAnalyticsEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>GoogleAnalyticsEventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStoreService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>LocalStoreService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>MessageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SessionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>SessionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>StorageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>UserService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/BaseError.html" data-type="entity-link">BaseError</a>
                    </li>
                    <li class="link">
                        <a href="classes/CustomNotification.html" data-type="entity-link">CustomNotification</a>
                    </li>
                    <li class="link">
                        <a href="classes/Globals.html" data-type="entity-link">Globals</a>
                    </li>
                    <li class="link">
                        <a href="classes/LoginResponse.html" data-type="entity-link">LoginResponse</a>
                    </li>
                    <li class="link">
                        <a href="classes/MyMissingTranslationHandler.html" data-type="entity-link">MyMissingTranslationHandler</a>
                    </li>
                    <li class="link">
                        <a href="classes/ResponseError.html" data-type="entity-link">ResponseError</a>
                    </li>
                    <li class="link">
                        <a href="classes/ServerUser.html" data-type="entity-link">ServerUser</a>
                    </li>
                    <li class="link">
                        <a href="classes/User.html" data-type="entity-link">User</a>
                    </li>
                    <li class="link">
                        <a href="classes/Utils.html" data-type="entity-link">Utils</a>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                        ${ isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"' }>
                        <span class="icon ion-md-arrow-round-down"></span>
                        <span>Injectables</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                            <li class="link">
                                <a href="injectables/BaseService.html" data-type="entity-link">BaseService</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                 ${ isNormalMode ? 'data-target="#guards-links"' : 'data-target="#xs-guards-links"' }>
            <span class="icon ion-ios-lock"></span>
            <span>Guards</span>
            <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
                ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                <li class="link">
                    <a href="guards/AdminGuard.html" data-type="entity-link">AdminGuard</a>
                </li>
                <li class="link">
                    <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                </li>
            </ul>
            </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                ${ isNormalMode ? 'data-target="#models-links"' : 'data-target="#xs-models-links"' }>
                <span class="icon ion-md-information-circle-outline"></span>
                <span>Interfaces</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? ' id="models-links"' : 'id="xs-models-links"' }>
                    <li class="link">
                        <a href="interfaces/AuthenticationServiceModel.html" data-type="entity-link">AuthenticationServiceModel</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/BaseServiceModel.html" data-type="entity-link">BaseServiceModel</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/FilterFieldElement.html" data-type="entity-link">FilterFieldElement</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/Mappable.html" data-type="entity-link">Mappable</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/Media.html" data-type="entity-link">Media</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/RouteInfo.html" data-type="entity-link">RouteInfo</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/UserMedia.html" data-type="entity-link">UserMedia</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/UserServiceModel.html" data-type="entity-link">UserServiceModel</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
