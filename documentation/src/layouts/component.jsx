import 'babel-polyfill';
import React from 'react';
import Heading from '@react/react-spectrum/Heading';
import Provider from '@react/react-spectrum/Provider';
import 'babel-polyfill';
import {SideNav, SideNavItem} from '@react/react-spectrum/SideNav';
import {Table, TR, TD, TH, THead, TBody} from '@react/react-spectrum/Table';
import {TabView, Tab} from '@react/react-spectrum/TabView';
import Link from '../components/Link';
import mdxComponents from '../mdx_components';
import Checkmark from '@react/react-spectrum/Icon/Checkmark';
import Header from '../components/Header';
import './css/index.css';
import './css/prism-okaidia.css';

export default class ComponentLayout extends React.Component {
  render() {
    let { children } = this.props;
    let allComponents = this.props.data.allComponents.edges.filter(c => c.node.id.includes(`src/${c.node.displayName}/`));
    let component = this.props.data.component;
    let related = this.props.data.relatedComponents
      ? this.props.data.relatedComponents.edges.filter(edge => edge.node.docblock && !edge.node.docblock.includes('@private'))
      : [];

    return (
      <Provider className="page component-page" theme="dark">
        <Header className="page-header" />
        <div className="page-main">
          <SideNav value={component.displayName} manageTabIndex typeToSelect autoFocus className="sidebar">
            {allComponents.map(edge => (
              <SideNavItem 
                key={edge.node.displayName} 
                href={`/components/${edge.node.displayName}`} 
                value={edge.node.displayName}>
                {edge.node.displayName}
              </SideNavItem>
            ))}
          </SideNav>
          <main className="page-content">
            <div className="documentation">
              <Heading size={1}>{component.displayName}</Heading>
              <TabView>
                <Tab label="Overview">
                  {children({
                    ...this.props,
                    components: mdxComponents
                  })}
                </Tab>
                <Tab label="API">
                  <ComponentAPI component={component} />
                  {related.map(edge =>
                    <section key={edge.node.displayName}>
                      <Heading size={1}>{edge.node.displayName}</Heading>
                      <ComponentAPI component={edge.node} />
                    </section>
                  )}
                  {this.props.data.relatedClasses && this.props.data.relatedClasses.edges.map(edge =>
                    <ClassAPI key={edge.node.id} node={edge.node} />
                  )}
                </Tab>
              </TabView>
            </div>
          </main>
        </div>
      </Provider>
    );
  }
}

function ComponentAPI({component}) {
  const methods = component.methods.filter(m => m.description && !m.docblock.includes('@private'));

  return (
    <section>
      {component.description &&
        <div dangerouslySetInnerHTML={{__html: component.description.childMarkdownRemark.html}} />
      }

      {component.props.length ?
        <section>
          <Heading size={2}>Props</Heading>
          <Table quiet>
            <THead>
              <TH>Prop</TH>
              <TH>Type</TH>
              <TH>Required</TH>
              <TH>Default</TH>
              <TH>Description</TH>
            </THead>
            <TBody>
              {component.props.map(prop => (
                  <TR key={prop.name}>
                    <TD><code>{prop.name}</code></TD>
                    <TD className="type-column"><code>{formatType(prop.type)}</code></TD>
                    <TD>{prop.required ? <Checkmark size="S" /> : null}</TD>
                    <TD><code>{prop.defaultValue && prop.defaultValue.value}</code></TD>
                    <TD><div dangerouslySetInnerHTML={{__html: prop.description && prop.description.childMarkdownRemark.html.slice(3, -4)}} /></TD>
                  </TR>
              ))}
            </TBody>
          </Table>
        </section>
      : null}

      {methods.length ?
        <section>
          <Heading size={2}>Methods</Heading>
          <Table quiet>
            <THead>
              <TH>Method</TH>
              <TH>Description</TH>
            </THead>
            <TBody>
              {methods.map(method =>
                <TR key={method.name}>
                  <TD><code>{formatMethod(method)}</code></TD>
                  <TD>{method.description}</TD>
                </TR>
              )}
            </TBody>
          </Table>
        </section>
      : null}
    </section>
  );
}

function ClassAPI({node}) {
  return (
    <section>
      <Heading size={1}>{node.name}</Heading>
      {node.description &&
        <div dangerouslySetInnerHTML={{__html: node.description.childMarkdownRemark.html}} />
      }

      {node.members.instance.length ?
        <section>
          <Heading size={2}>Methods</Heading>
          <Table quiet>
            <THead>
              <TH>Method</TH>
              <TH>Abstract</TH>
              <TH>Description</TH>
            </THead>
            <TBody>
              {node.members.instance.map(method =>
                <TR key={method.name}>
                  <TD><code>{formatMethod(method)}</code></TD>
                  <TD>{method.abstract ? <Checkmark size="S" /> : null}</TD>
                  <TD><div dangerouslySetInnerHTML={{__html: method.description && method.description.childMarkdownRemark.html.slice(3, -4)}} /></TD>
                </TR>
              )}
            </TBody>
          </Table>
        </section>
      : null}
    </section>
  );
}

const indentDefault = '10px';

function renderShape(value, indent) {
  const startObject = 'shape: {';
  const endObject = '}';
  if(value.value) {
    return (
      <div style={{paddingLeft: indent}}>
        <div>{startObject}</div>
        <div style={{paddingLeft: indent}}>
          {Object.keys(value.value).map(key => {
            return (
              <div key={key}>
                {key}: {formatType(value.value[key], indentDefault)}
              </div>
            );
          })}
        </div>
        <div>{endObject}</div>
      </div>
    );
  }
  return (
    <div style={{paddingLeft: indent}}>
      <div>{startObject}{endObject}</div>
    </div>
  );
}

function renderArrayOf(value, indent) {
  if(value.value) {
    return (
      <div style={{paddingLeft: indent}}>
        <div>arrayOf: [</div>
        {formatType(value.value, indentDefault)}
        <div>]</div>
      </div>
    );
  }
  return <div style={{paddingLeft: indent}}>{value.name}</div>;
}

function renderOneOf(value, indent) {
  return (
    <div style={{paddingLeft: indent}}>
      <div>oneOf: [</div>
      {value.value.map(v => <div key={v.name}>{formatType(v, indentDefault)}</div>)}
      <div>]</div>
    </div>
  );
}


function formatType(type, indent='0px') {
  if (!type) return '';
  if (type.name === 'arrayOf') {
    return renderArrayOf(type, indent);
  }
  if (type.name === 'shape') {
    return renderShape(type, indent);
  }

  if (type.name === 'union') {
    if(Array.isArray(type.value)) {
      return renderOneOf(type, indent);
    }
    return <div style={{paddingLeft: indent}}>{type.value}</div>;
  }
  if (type.name === 'enum') {
    return type.value.map(v => v.value || v.name).join(' | ');
  }
  if (type.name === 'instanceOf') {
    return <div style={{paddingLeft: indent}}>{`instanceOf: ${type.value}`}</div>;
  }

  return <div style={{paddingLeft: indent}}>{type.name}</div>;
}

function formatMethod(method) {
  let res = [...(method.modifiers || []), `${method.name}(${method.params.map(formatParam).join(', ')})`].join(' ');
  if (method.returns && method.returns[0] && method.returns[0].type.name) {
    res += ': ' + method.returns[0].type.name;
  }

  return res;
}

function formatParam(param) {
  let p = param.name;
  if (param.type && param.type.name) {
    p += ': ' + param.type.name;
  }

  if (param.default) {
    p += ' = ' + param.default;
  }

  return p;
}

export const pageQuery = graphql`
  fragment componentFields on ComponentMetadata {
    displayName
    docblock
    description {
      text
      childMarkdownRemark {
        html
      }
    }
    methods {
      name
      description
      params {
        name
      }
      docblock
    }
    props {
      name
      type {
        name
        value
      }
      required
      description {
        text
        childMarkdownRemark {
          html
        }
      }
      defaultValue {
        value
      }
    }
  }

  fragment docFields on DocumentationJs {
    id
    name
    description {
      childMarkdownRemark {
        html
      }
    }
    returns {
      title
    }
    memberof
    scope
    params {
      name
      type {
        name
      }
      description {
        childMarkdownRemark {
          html
        }
      }
    }
    members {
      instance {
        name
        abstract
        description {
          childMarkdownRemark {
            html
          }
        }
        params {
          name
          type {
            name
          }
          default
        }
        returns {
          type {
            name
          }
        }
      }
    }
  }

  query ComponentLayoutQuery($componentName: String, $relatedComponents: String, $relatedClasses: String) {
    allComponents:allComponentMetadata(sort:{fields:[displayName]}) {
      edges {
        node {
          id
          displayName
        }
      }
    }
    component:componentMetadata(displayName:{eq:$componentName}) {
      ...componentFields
    }
    relatedComponents:allComponentMetadata(filter:{displayName:{regex:$relatedComponents}}) {
      edges {
        node {
          ...componentFields
        }
      }
    }
    relatedClasses:allDocumentationJs(filter:{name:{regex:$relatedClasses}}) {
      edges {
        node {
          ...docFields
        }
      }
    }
  }
`;
