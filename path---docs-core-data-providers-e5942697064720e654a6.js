webpackJsonp([8948977308931],{395:function(n,a){n.exports={data:{post:{html:'<h1 id="data-providers"><a href="#data-providers" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Data Providers</h1>\n<p>To retrieve data exposed by the API, API Platform uses classes called <strong>data providers</strong>. A data provider using <a href="http://www.doctrine-project.org/projects/orm.html" target="_blank" rel="nofollow noopener noreferrer">Doctrine\nORM</a> to retrieve data from a database is included with the library and\nis enabled by default. This data provider natively supports paged collections and filters. It can be used as is and fits\nperfectly with common usages.</p>\n<p>However, you sometime want to retrieve data from other sources such as another persistence layer, a webservice, ElasticSearch\nor MongoDB.\nCustom data providers can be used to do so. A project can include as many data providers as it needs. The first able to\nretrieve data for a given resource will be used.</p>\n<p>For a given resource, you can implement two kind of interfaces:</p>\n<ul>\n<li>the <a href="https://github.com/api-platform/core/blob/master/src/DataProvider/CollectionDataProviderInterface.php" target="_blank" rel="nofollow noopener noreferrer"><code>CollectionDataProviderInterface</code></a>\nis used when fetching a collection.</li>\n<li>the <a href="https://github.com/api-platform/core/blob/master/src/DataProvider/ItemDataProviderInterface.php" target="_blank" rel="nofollow noopener noreferrer"><code>ItemDataProviderInterface</code></a>\nis used when fetching items.</li>\n</ul>\n<p>Both implementations can also implement a third, optional interface called\n<a href="https://github.com/api-platform/core/blob/master/src/DataProvider/RestrictedDataProviderInterface.php" target="_blank" rel="nofollow noopener noreferrer">\'RestrictedDataProviderInterface\'</a>\nif you want to limit their effects to a single resource or operation.</p>\n<p>In the following examples we will create custom data providers for an entity class called <code>App\\Entity\\BlogPost</code>.\nNote, that if your entity is not Doctrine-related, you need to flag the identifier property by using <code>@ApiProperty(identifier=true)</code> for things to work properly (see also <a href="/docs/core/serialization#entity-identifier-case">Entity Identifier Case</a>).</p>\n<h2 id="custom-collection-data-provider"><a href="#custom-collection-data-provider" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Custom Collection Data Provider</h2>\n<p>First, your <code>BlogPostCollectionDataProvider</code> has to implement the <a href="https://github.com/api-platform/core/blob/master/src/DataProvider/CollectionDataProviderInterface.php" target="_blank" rel="nofollow noopener noreferrer"><code>CollectionDataProviderInterface</code></a>:</p>\n<p>The <code>getCollection</code> method must return an <code>array</code>, a <code>Traversable</code> or a <a href="https://github.com/api-platform/core/blob/master/src/DataProvider/PaginatorInterface.php" target="_blank" rel="nofollow noopener noreferrer"><code>ApiPlatform\\Core\\DataProvider\\PaginatorInterface</code></a> instance.\nIf no data is available, you should return an empty array.</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token delimiter important">&lt;?php</span>\n<span class="token comment">// api/src/DataProvider/BlogPostCollectionDataProvider.php</span>\n\n<span class="token keyword">namespace</span> <span class="token package">App<span class="token punctuation">\\</span>DataProvider</span><span class="token punctuation">;</span>\n\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>DataProvider<span class="token punctuation">\\</span>CollectionDataProviderInterface</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>DataProvider<span class="token punctuation">\\</span>RestrictedDataProviderInterface</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>Exception<span class="token punctuation">\\</span>ResourceClassNotSupportedException</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">App<span class="token punctuation">\\</span>Entity<span class="token punctuation">\\</span>BlogPost</span><span class="token punctuation">;</span>\n\n<span class="token keyword">final</span> <span class="token keyword">class</span> <span class="token class-name">BlogPostCollectionDataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">CollectionDataProviderInterface</span><span class="token punctuation">,</span> RestrictedDataProviderInterface\n<span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">supports</span><span class="token punctuation">(</span>string <span class="token variable">$resourceClass</span><span class="token punctuation">,</span> string <span class="token variable">$operationName</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">array</span> <span class="token variable">$context</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> bool\n    <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> BlogPost<span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token keyword">class</span> <span class="token operator">===</span> <span class="token variable">$resourceClass</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">getCollection</span><span class="token punctuation">(</span>string <span class="token variable">$resourceClass</span><span class="token punctuation">,</span> string <span class="token variable">$operationName</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">:</span> \\<span class="token package">Generator</span>\n    <span class="token punctuation">{</span>\n        <span class="token comment">// Retrieve the blog post collection from somewhere</span>\n        <span class="token keyword">yield</span> <span class="token keyword">new</span> <span class="token class-name">BlogPost</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">yield</span> <span class="token keyword">new</span> <span class="token class-name">BlogPost</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Then declare a Symfony service, for example:</p>\n<div class="gatsby-highlight">\n      <pre class="language-yaml"><code><span class="token comment"># api/config/services.yaml</span>\n<span class="token key atrule">services</span><span class="token punctuation">:</span>\n    <span class="token comment"># ...</span>\n    <span class="token key atrule">\'App\\DataProvider\\BlogPostCollectionDataProvider\'</span><span class="token punctuation">:</span>\n        <span class="token key atrule">tags</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token punctuation">{</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">\'api_platform.collection_data_provider\'</span><span class="token punctuation">,</span> <span class="token key atrule">priority</span><span class="token punctuation">:</span> <span class="token number">2 </span><span class="token punctuation">}</span> <span class="token punctuation">]</span>\n        <span class="token comment"># Autoconfiguration must be disabled to set a custom priority</span>\n        <span class="token key atrule">autoconfigure</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>\n</code></pre>\n      </div>\n<p>Tagging the service with the tag <code>api_platform.collection_data_provider</code> will enable API Platform Core to automatically\nregister and use this data provider. The optional attribute <code>priority</code> allows to define the order in which the\ndata providers are called. The first data provider not throwing a <code>ApiPlatform\\Core\\Exception\\ResourceClassNotSupportedException</code>\nwill be used.</p>\n<h2 id="custom-item-data-provider"><a href="#custom-item-data-provider" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Custom Item Data Provider</h2>\n<p>The process is similar for item data providers. Create a <code>BlogPostItemDataProvider</code> implementing the <a href="https://github.com/api-platform/core/blob/master/src/DataProvider/ItemDataProviderInterface.php" target="_blank" rel="nofollow noopener noreferrer"><code>ItemDataProviderInterface</code></a>\ninterface:</p>\n<p>The <code>getItem</code> method can return <code>null</code> if no result has been found.</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token delimiter important">&lt;?php</span>\n<span class="token comment">// api/src/DataProvider/BlogPostItemDataProvider.php</span>\n\n<span class="token keyword">namespace</span> <span class="token package">App<span class="token punctuation">\\</span>DataProvider</span><span class="token punctuation">;</span>\n\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>DataProvider<span class="token punctuation">\\</span>ItemDataProviderInterface</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>DataProvider<span class="token punctuation">\\</span>RestrictedDataProviderInterface</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>Exception<span class="token punctuation">\\</span>ResourceClassNotSupportedException</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">App<span class="token punctuation">\\</span>Entity<span class="token punctuation">\\</span>BlogPost</span><span class="token punctuation">;</span>\n\n<span class="token keyword">final</span> <span class="token keyword">class</span> <span class="token class-name">BlogPostItemDataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">ItemDataProviderInterface</span><span class="token punctuation">,</span> RestrictedDataProviderInterface\n<span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">supports</span><span class="token punctuation">(</span>string <span class="token variable">$resourceClass</span><span class="token punctuation">,</span> string <span class="token variable">$operationName</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">array</span> <span class="token variable">$context</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> bool\n    <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> BlogPost<span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token keyword">class</span> <span class="token operator">===</span> <span class="token variable">$resourceClass</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">getItem</span><span class="token punctuation">(</span>string <span class="token variable">$resourceClass</span><span class="token punctuation">,</span> <span class="token variable">$id</span><span class="token punctuation">,</span> string <span class="token variable">$operationName</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">array</span> <span class="token variable">$context</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token operator">?</span>BlogPost\n    <span class="token punctuation">{</span>\n        <span class="token comment">// Retrieve the blog post item from somewhere then return it or null if not found</span>\n        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">BlogPost</span><span class="token punctuation">(</span><span class="token variable">$id</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>If service autowiring and autoconfiguration are enabled (it\'s the case by default), you are done!</p>\n<p>Otherwise, if you use a custom dependency injection configuration, you need to register the corresponding service and add the\n<code>api_platform.item_data_provider</code> tag to it. As for collection data providers, the <code>priority</code> attribute can be used to order\nproviders.</p>\n<div class="gatsby-highlight">\n      <pre class="language-yaml"><code><span class="token comment"># api/config/services.yaml</span>\n<span class="token key atrule">services</span><span class="token punctuation">:</span>\n    <span class="token comment"># ...</span>\n    <span class="token key atrule">\'App\\DataProvider\\BlogPostItemDataProvider\'</span><span class="token punctuation">:</span> <span class="token null important">~</span>\n        <span class="token comment"># Uncomment only if autoconfiguration is disabled</span>\n        <span class="token comment">#tags: [ \'api_platform.item_data_provider\' ]</span>\n</code></pre>\n      </div>\n<h2 id="injecting-the-serializer-in-an-itemdataprovider"><a href="#injecting-the-serializer-in-an-itemdataprovider" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Injecting the Serializer in an <code>ItemDataProvider</code></h2>\n<p>In some cases, you may need to inject the <code>Serializer</code> in your <code>DataProvider</code>. There are no issues with the\n<code>CollectionDataProvider</code>, but when injecting it in the <code>ItemDataProvider</code> it will throw a <code>CircularReferenceException</code>.</p>\n<p>For this reason, we implemented the <code>SerializerAwareDataProviderInterface</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token delimiter important">&lt;?php</span>\n<span class="token comment">// api/src/DataProvider/BlogPostItemDataProvider.php</span>\n\n<span class="token keyword">namespace</span> <span class="token package">App<span class="token punctuation">\\</span>DataProvider</span><span class="token punctuation">;</span>\n\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>DataProvider<span class="token punctuation">\\</span>ItemDataProviderInterface</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>DataProvider<span class="token punctuation">\\</span>SerializerAwareDataProviderInterface</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>DataProvider<span class="token punctuation">\\</span>SerializerAwareDataProviderTrait</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">ApiPlatform<span class="token punctuation">\\</span>Core<span class="token punctuation">\\</span>Exception<span class="token punctuation">\\</span>ResourceClassNotSupportedException</span><span class="token punctuation">;</span>\n<span class="token keyword">use</span> <span class="token package">App<span class="token punctuation">\\</span>Entity<span class="token punctuation">\\</span>BlogPost</span><span class="token punctuation">;</span>\n\n<span class="token keyword">final</span> <span class="token keyword">class</span> <span class="token class-name">BlogPostItemDataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">ItemDataProviderInterface</span><span class="token punctuation">,</span> SerializerAwareDataProviderInterface\n<span class="token punctuation">{</span>\n    <span class="token keyword">use</span> <span class="token package">SerializerAwareDataProviderTrait</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">supports</span><span class="token punctuation">(</span>string <span class="token variable">$resourceClass</span><span class="token punctuation">,</span> string <span class="token variable">$operationName</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">array</span> <span class="token variable">$context</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> bool\n    <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> BlogPost<span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token keyword">class</span> <span class="token operator">===</span> <span class="token variable">$resourceClass</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">getItem</span><span class="token punctuation">(</span>string <span class="token variable">$resourceClass</span><span class="token punctuation">,</span> <span class="token variable">$id</span><span class="token punctuation">,</span> string <span class="token variable">$operationName</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">array</span> <span class="token variable">$context</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token operator">?</span>BlogPost\n    <span class="token punctuation">{</span>\n        <span class="token comment">// Retrieve data from anywhere you want, in a custom format</span>\n        <span class="token variable">$data</span> <span class="token operator">=</span> <span class="token string">\'...\'</span><span class="token punctuation">;</span>\n\n        <span class="token comment">// Deserialize data using the Serializer</span>\n        <span class="token keyword">return</span> <span class="token variable">$this</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">getSerializer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">deserialize</span><span class="token punctuation">(</span><span class="token variable">$data</span><span class="token punctuation">,</span> BlogPost<span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token string">\'custom\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h2 id="injecting-extensions-pagination-filter-eagerloading-etc"><a href="#injecting-extensions-pagination-filter-eagerloading-etc" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Injecting Extensions (Pagination, Filter, EagerLoading etc.)</h2>\n<p>ApiPlatform provides a few extensions that you can reuse in your custom DataProvider.\nNote that there are a few kind of extensions which are detailed in <a href="/docs/core/extensions">their own chapter of the documentation</a>.\nBecause extensions are tagged services, you can use the <a href="https://symfony.com/blog/new-in-symfony-3-4-simpler-injection-of-tagged-services" target="_blank" rel="nofollow noopener noreferrer">injection of tagged services</a>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-yaml"><code><span class="token key atrule">services</span><span class="token punctuation">:</span>\n    <span class="token key atrule">\'App\\DataProvider\\BlogPostItemDataProvider\'</span><span class="token punctuation">:</span>\n        <span class="token key atrule">arguments</span><span class="token punctuation">:</span>\n          <span class="token key atrule">$itemExtensions</span><span class="token punctuation">:</span> <span class="token tag">!tagged</span> api_platform.doctrine.orm.query_extension.item\n</code></pre>\n      </div>\n<p>Or in XML:</p>\n<div class="gatsby-highlight">\n      <pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>services</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>service</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>App\\DataProvider\\BlogPostItemDataProvider<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>argument</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>$itemExtensions<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>tagged<span class="token punctuation">"</span></span> <span class="token attr-name">tag</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>api_platform.doctrine.orm.query_extension.item<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>service</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>services</span><span class="token punctuation">></span></span>\n</code></pre>\n      </div>\n<p>Your data provider will now have access to the core extensions, here is an example on how to use them:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code><?php\n// api/src/DataProvider/BlogPostItemDataProvider.php\n\nnamespace App\\DataProvider;\n\nuse ApiPlatform\\Core\\Bridge\\Doctrine\\Orm\\Util\\QueryNameGenerator;\nuse ApiPlatform\\Core\\DataProvider\\ItemDataProviderInterface;\nuse ApiPlatform\\Core\\DataProvider\\RestrictedDataProviderInterface;\nuse ApiPlatform\\Core\\Exception\\ResourceClassNotSupportedException;\nuse App\\Entity\\BlogPost;\nuse Doctrine\\Common\\Persistence\\ManagerRegistry;\n\nfinal class BlogPostItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface\n{\n    private $itemExtensions;\n    private $managerRegistry;\n\n    public function __construct(ManagerRegistry $managerRegistry, iterable $itemExtensions)\n    {\n      $this->managerRegistry = $managerRegistry;\n      $this->itemExtensions = $itemExtensions;\n    }\n\n    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool\n    {\n        return BlogPost::class === $resourceClass;\n    }\n\n    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?BlogPost\n    {\n        $manager = $this->managerRegistry->getManagerForClass($resourceClass);\n        $repository = $manager->getRepository($resourceClass);\n        $queryBuilder = $repository->createQueryBuilder(\'o\');\n        $queryNameGenerator = new QueryNameGenerator();\n        $identifiers = [\'id\' => $id];\n\n        foreach ($this->itemExtensions as $extension) {\n            $extension->applyToItem($queryBuilder, $queryNameGenerator, $resourceClass, $identifiers, $operationName, $context);\n            if ($extension instanceof QueryResultItemExtensionInterface && $extension->supportsResult($resourceClass, $operationName, $context))                 {\n                return $extension->getResult($queryBuilder, $resourceClass, $operationName, $context);\n            }\n        }\n\n        return $queryBuilder->getQuery()->getOneOrNullResult();\n    }\n}</code></pre>\n      </div>'},navDoc:{edges:[{node:{title:"The Distribution",path:"distribution",items:[{id:"index",title:"Creating a Fully Featured API in 5 Minutes",anchors:null},{id:"testing",title:"Testing and Specifying the API",anchors:null}]}},{node:{title:"The API Component",path:"core",items:[{id:"index",title:"Introduction",anchors:null},{id:"getting-started",title:"Getting Started",anchors:[{id:"installing-api-platform-core",title:"Installing API Platform Core"},{id:"before-reading-this-documentation",title:"Before Reading this Documentation"},{id:"mapping-the-entities",title:"Mapping the Entities"}]},{id:"configuration",title:"Configuration",anchors:null},{id:"operations",title:"Operations",anchors:[{id:"enabling-and-disabling-operations",title:"Enabling and Disabling Operations"},{id:"configuring-operations",title:"Configuring Operations"},{id:"subresources",title:"Subresources"},{id:"creating-custom-operations-and-controllers",title:"Creating Custom Operations and Controllers"}]},{id:"default-order",title:"Overriding Default Order",anchors:null},{id:"filters",title:"Filters",anchors:[{id:"doctrine-orm-filters",title:"Doctrine ORM Filters"},{id:"serializer-filters",title:"Serializer Filters"},{id:"creating-custom-filters",title:"Creating Custom Filters"},{id:"apifilter-annotation",title:"ApiFilter Annotation"}]},{id:"serialization",title:"The Serialization Process",anchors:[{id:"overall-process",title:"Overall Process"},{id:"available-serializers",title:"Available Serializers"},{id:"the-serialization-context-groups-and-relations",title:"The Serialization Context, Groups and Relations"},{id:"using-serialization-groups",title:"Using Serialization Groups"},{id:"using-different-serialization-groups-per-operation",title:"Using Different Serialization Groups per Operation"},{id:"changing-the-serialization-context-dynamically",title:"Changing the Serialization Context Dynamically"},{id:"changing-the-serialization-context-on-a-per-item-basis",title:"Changing the Serialization Context on a Per Item Basis"},{id:"name-conversion",title:"Name Conversion"},{id:"decorating-a-serializer-and-add-extra-data",title:"Decorating a Serializer and Add Extra Data"},{id:"entity-identifier-case",title:"Entity Identifier Case"},{id:"embedding-the-json-ld-context",title:"Embedding the JSON-LD Context"}]},{id:"validation",title:"Validation",anchors:[{id:"using-validation-groups",title:"Using Validation Groups"},{id:"dynamic-validation-groups",title:"Dynamic Validation Groups"},{id:"error-levels-and-payload-serialization",title:"Error Levels and Payload Serialization"}]},{id:"errors",title:"Error Handling",
anchors:[{id:"converting-php-exceptions-to-http-errors",title:"Converting PHP Exceptions to HTTP Errors"}]},{id:"pagination",title:"Pagination",anchors:[{id:"disabling-the-pagination",title:"Disabling the Pagination"},{id:"changing-the-number-of-items-per-page",title:"Changing the Number of Items per Page"},{id:"partial-pagination",title:"Partial Pagination"}]},{id:"events",title:"The Event System",anchors:null},{id:"content-negotiation",title:"Content Negotiation",anchors:[{id:"enabling-several-formats",title:"Enabling Several Formats"},{id:"registering-a-custom-serializer",title:"Registering a Custom Serializer"},{id:"creating-a-responder",title:"Creating a Responder"},{id:"writing-a-custom-normalizer",title:"Writing a Custom Normalizer"}]},{id:"external-vocabularies",title:"Using External JSON-LD Vocabularies",anchors:null},{id:"extending-jsonld-context",title:"Extending JSON-LD context",anchors:null},{id:"data-providers",title:"Data Providers",anchors:[{id:"custom-collection-data-provider",title:"Custom Collection Data Provider"},{id:"custom-item-data-provider",title:"Custom Item Data Provider"},{id:"injecting-the-serializer-in-an-itemdataprovider",title:'Injecting the Serializer in an "ItemDataProvider"'}]},{id:"extensions",title:"Extensions",anchors:[{id:"custom-extension",title:"Custom Extension"},{id:"example",title:"Filter upon the current user"}]},{id:"security",title:"Security",anchors:null},{id:"performance",title:"Performance",anchors:[{id:"enabling-the-builtin-http-cache-invalidation-system",title:"Enabling the Built-in HTTP Cache Invalidation System"},{id:"enabling-the-metadata-cache",title:"Enabling the Metadata Cache"},{id:"using-ppm-php-pm",title:"Using PPM (PHP-PM)"},{id:"doctrine-queries-and-indexes",title:"Doctrine Queries and Indexes"}]},{id:"operation-path-naming",title:"Operation Path Naming",anchors:[{id:"configuration",title:"Configuration"},{id:"create-a-custom-operation-path-resolver",title:"Create a Custom Operation Path Naming"}]},{id:"form-data",title:"Accept application/x-www-form-urlencoded Form Data",anchors:null},{id:"fosuser-bundle",title:"FOSUserBundle Integration",anchors:[{id:"installing-the-bundle",title:"Installing the Bundle"},{id:"enabling-the-bridge",title:"Enabling the Bridge"},{id:"creating-a-user-entity-with-serialization-groups",title:'Creating a "User" Entity with Serialization Groups'}]},{id:"jwt",title:"Adding a JWT authentication using LexikJWTAuthenticationBundle",anchors:[{id:"testing-with-swagger",title:"Testing with Swagger"},{id:"testing-with-behat",title:"Testing with Behat"}]},{id:"nelmio-api-doc",title:"NelmioApiDocBundle integration",anchors:null},{id:"angularjs-integration",title:"AngularJS Integration",anchors:[{id:"restangular",title:"Restangular"},{id:"ng-admin",title:"ng-admin"}]},{id:"swagger",title:"Swagger Support",anchors:[{id:"override-swagger-documentation",title:"Override Swagger documentation"}]},{id:"graphql",title:"GraphQL Support",anchors:[{id:"overall-view",title:"Overall View"},{id:"enabling-graphql",title:"Enabling GraphQL"},{id:"graphiql",title:"GraphiQL"}]},{id:"dto",title:"Handling Data Transfer Objects (DTOs)",anchors:null}]}},{node:{title:"The Schema Generator Component",path:"schema-generator",items:[{id:"index",title:"Introduction",anchors:null},{id:"getting-started",title:"Getting Started",anchors:null},{id:"configuration",title:"Configuration",anchors:null}]}},{node:{title:"The Admin Component",path:"admin",items:[{id:"index",title:"Introduction",anchors:[{id:"features",title:"Features"}]},{id:"getting-started",title:"Getting Started",anchors:[{id:"installation",title:"Installation"},{id:"creating-the-admin",title:"Creating the Admin"},{id:"customizing-the-admin",title:"Customizing the Admin"}]},{id:"authentication-support",title:"Authentication Support",anchors:null},{id:"handling-relations-to-collections",title:"Handling Relations to Collections",anchors:[{id:"using-an-autocomplete-input-for-relations",title:"Using an Autocomplete Input for Relations"}]}]}},{node:{title:"The Client Generator Component",path:"client-generator",items:[{id:"index",title:"Introduction",anchors:[{id:"features",title:"Features"}]},{id:"react",title:"React generator",anchors:null},{id:"vuejs",title:"Vue.js generator",anchors:null},{id:"troubleshooting",title:"Troubleshooting",anchors:null}]}},{node:{title:"Deployment",path:"deployment",items:[{id:"index",title:"Introduction",anchors:null},{id:"kubernetes",title:"Deploying to a Kubernetes Cluster",anchors:null},{id:"heroku",title:"Deploying an API Platform App on Heroku",anchors:null}]}},{node:{title:"Extra",path:"extra",items:[{id:"releases",title:"The Release Process",anchors:null},{id:"philosophy",title:"The Project's Philosophy",anchors:null},{id:"troubleshooting",title:"Troubleshooting",anchors:null},{id:"contribution-guides",title:"Contribution Guides",anchors:null},{id:"conduct",title:"Contributor Code Of Conduct",anchors:null}]}}]}},pathContext:{path:"docs/core/data-providers",current:{path:"docs/core/data-providers",title:"The API Component - Data Providers"},prev:{path:"docs/core/extending-jsonld-context",title:"Extending JSON-LD context",rootPath:"The API Component"},next:{path:"docs/core/extensions",title:"Extensions",rootPath:"The API Component"}}}}});
//# sourceMappingURL=path---docs-core-data-providers-e5942697064720e654a6.js.map