/**
 * @overview a fork of ccm.content.js (A. Kless - https://ccmjs.github.io/akless-components/content/ccm.content.js)
 * extended for logging
 * @author Michael Nutzenberger <michael.nutzenberger@inf.h-brs.de> 2019
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 */

( function () {

  const component = {

    name: 'content',

    ccm: 'https://ccmjs.github.io/ccm/ccm.js',

    config: {

  //  inner: 'Hello, World!',       // predefined content (could be given as HTML string, DOM Element Nodes or ccm HTML data)
  //  placeholder: { foo: 'bar' },  // replaces all '%foo%' in predefined content with 'bar'
  //  afterstart: function () {}    // callback after instances has started ('this' is instance)
  //  "logger": [ "ccm.instance", "https://mnutze.github.io/bsc.log/ccm.log.js", ["ccm.get", "https://mnutze.github.io/bsc.log/resources/configs.js", "greedy" ] ]

    },

    Instance: function () {

      let $;

      this.init = async () => {

        // set shortcut to help functions
        $ = this.ccm.helper;

        // no Light DOM? => use empty fragment
        if ( !this.inner ) this.inner = document.createDocumentFragment();

        // Light DOM is given as HTML string? => use fragment with HTML string as innerHTML
        if ( typeof this.inner === 'string' ) this.inner = document.createRange().createContextualFragment( this.inner );

        // Light DOM is given as ccm HTML data? => convert to HTML DOM Elements
        if ( $.isObject( this.inner ) && !$.isElementNode( this.inner ) )
          this.inner = $.html( this.inner );

        // dynamic replacement of placeholders
        if ( this.placeholder ) [ ...this.inner.children ].forEach( child => child.innerHTML = $.format( child.innerHTML, this.placeholder ) );

        // collect all ccm dependencies in Light DOM
        const self = this; if ( !this.dependencies ) { this.dependencies = []; collectDependencies( this.inner ); }

        /**
         * collects all dependencies in given DOM Element Node (recursive)
         * @param {Element} node - DOM Element Node
         */
        function collectDependencies( node ) {

          // iterate over all child DOM Element Nodes
          [ ...node.children ].forEach( child => {

            // no ccm Custom Element? => abort and collect dependencies inside of it
            if ( child.tagName.indexOf( 'CCM-' ) !== 0 ) return collectDependencies( child );  // recursive call

            // generate ccm dependency out of founded ccm Custom Element
            const component = getComponent(); if ( !component ) return;
            const config = $.generateConfig( child );
            config.parent = self;
            config.root = child;
            self.dependencies.push( $.isComponent( component ) ? [ component, config ] : [ 'ccm.start', component, config ] );

            /**
             * gets object, index or URL of ccm component that corresponds to founded ccm Custom Element
             * @returns {Object|string}
             */
            function getComponent() {

              /**
               * index of ccm component
               * @type {string}
               */
              const index = child.tagName.substr( 4 ).toLowerCase();

              // has dependency to ccm component? => result is component object
              if ( self.components && self.components[ index ] ) return self.components[ index ];
              if ( $.isComponent( self[ index ] ) ) return self[ index ];

              // component is already registered? => result is component index
              if ( self.ccm.components[ index ] ) return index;

              // search inner HTML of own Custom Element for a source tag that contains the component URL
              const sources = self.inner.querySelectorAll( 'source' );
              for ( let i = 0; i < sources.length; i++ )
                if ( $.getIndex( sources[ i ].getAttribute( 'src' ) ) === index )
                  return sources[ i ].getAttribute( 'src' );

            }

          } );

        }

      };

      this.start = async () => {

        // render content that is given via Light DOM
        $.setContent( this.element, this.inner );

        // embed dependent components
        for ( let i = 0; i < this.dependencies.length; i++ )
          if ( $.isComponent( this.dependencies[ i ][ 0 ] ) )
            await this.dependencies[ i ][ 0 ].start( this.dependencies[ i ][ 1 ] );
          else
            this.dependencies[ i ] = await $.solveDependency( this.dependencies[ i ] );

        // logging of 'start' event
        this.logger && this.logger.log( 'start', undefined );

        // perform after start callback
        this.afterstart && this.afterstart.call( this );

      };

    }

  };

  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();