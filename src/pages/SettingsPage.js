/* eslint-disable jsx-a11y/href-no-hash */

import React from 'react';

import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Alert,
  UncontrolledAlert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, CardTitle, CardText } from 'reactstrap';
import classnames from 'classnames';

import Page from 'components/Page';

import ReactTable from "react-table";
import "react-table/react-table.css";
import { rename } from 'fs';
import { setServiceResult } from '../actions';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      service: this.props.service,
      serviceColumn: [],
      new_therapy_service: 'New Therapy Service',
      count: 0
    };
    this.renderEditable = this.renderEditable.bind(this);
  }
  renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }
  
  renderEditable(cellInfo) {
    if (cellInfo.column.Header === 'Services')
    {
      return (
        <div
          style={{ backgroundColor: "#fafafa" }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            this.state.service[cellInfo.index].provider = e.target.innerHTML;
            this.forceUpdate()
          }}
          dangerouslySetInnerHTML={{
            __html: this.state.service[cellInfo.index].provider
          }}
        />
      );
    }
    else if (cellInfo.column.Header === 'Therapy PT Code')
    {
      return (
        <div
          style={{ backgroundColor: "#fafafa" }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            this.state.service.map((el,key) => {
              const newKeys = {
                [Object.keys(el)[cellInfo.index + 1]]: e.target.innerHTML
              }

              const renamedObj = this.renameKeys(el, newKeys);
              this.state.service[key] = renamedObj
            })
            this.forceUpdate()
            this.generateServiceColumn();

          }}
          dangerouslySetInnerHTML={{
            __html: Object.keys(this.state.service[0])[cellInfo.index +1]
          }}
        />
      );
    }
    else if (cellInfo.column.Header === 'Insurance Provider') {
      return (
        <div
          style={{ backgroundColor: "#fafafa" }}
          dangerouslySetInnerHTML={{
            __html: this.state.service[cellInfo.index].provider
          }}
        />
      );
    }
    else {
      return (
        <div
          style={{ backgroundColor: "#fafafa" }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            this.state.service[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
            this.forceUpdate()
          }}
          dangerouslySetInnerHTML={{
            __html: this.state.service[cellInfo.index][cellInfo.column.id]
          }}
        />
      );
    }
  }


  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  addNew(index) {
    if (index === 'insurance_provider')
    {
      this.state.service.push({
        provider: 'New Insurance Provider'
      });
    }
    else {
      this.setState({count: this.state.count + 1});
      const new_therapy_service = this.state.new_therapy_service + this.state.count;
      this.state.service.map(e => {
        e[new_therapy_service] = 0
      })
    }
    this.generateServiceColumn()
    this.forceUpdate();
  }

  save() {
    this.props.dispatch(setServiceResult(this.state.service))
  }

  generateServiceColumn() {
    const serviceColumn = [];
    Object.keys(this.state.service[0]).map(key => {
      if (key === 'provider')
      {
        serviceColumn.push({
          Header: "Insurance Provider",
          id: 'reimbursement',
          Cell: this.renderEditable
          });    
      }
      else
      {
        serviceColumn.push({
          Header: key,
          id: key,
          Cell: this.renderEditable
          });    
      }
    })
    this.setState({serviceColumn});
  }

  componentWillMount() {
    // if(!this.props.auth.token)
      // this.props.history.push('/');
  }

  componentDidMount() {
    this.generateServiceColumn();
  }
  render() {
    return (
      <Page
        title="Settings"
      >
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Reimbursement
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Insurance Providers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              Services
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <ReactTable
                  data={this.state.service}
                  columns={this.state.serviceColumn}
                    defaultPageSize={this.state.service.length}
                    pageSize={this.state.service.length}
                    className="-striped -highlight"
                    showPageSizeOptions= {true}
                    showPagination= {false}
                  />
              </Col>
              <Col sm="12" className="pull-right">
                <Button style={{float:'right'}}>Cancel</Button>
                <Button color="primary" onClick={() => this.save()} style={{float:'right', marginRight: '20px'}}>Save</Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row style={{marginTop: '30px'}}>
              <Col sm="6">
                <ReactTable
                    data={this.state.service}
                    columns={[{
                      Header: "Services",
                      id: 'service',
                      Cell: this.renderEditable
                      }]}
                      defaultPageSize={this.state.service.length}
                      pageSize={this.state.service.length}
                      className="-striped -highlight"
                      showPageSizeOptions= {true}
                      showPagination= {false}
                  />
              </Col>
              <Col sm="6">
                <Button color="primary" onClick={() => this.addNew('insurance_provider')}>Add Insurance Provider</Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row style={{marginTop: '30px'}}>
                <Col sm="6">
                  <ReactTable
                      data={Object.keys(this.state.service[0])}
                      columns={[{
                        Header: "Therapy PT Code",
                        id: 'therapy',
                        accessor: 'therapy',
                        Cell: this.renderEditable
                        }]}
                        defaultPageSize={Object.keys(this.state.service[0]).length -1}
                        pageSize={Object.keys(this.state.service[0]).length -1}
                        className="-striped -highlight"
                        showPageSizeOptions= {true}
                        showPagination= {false}
                    />
                </Col>
                <Col sm="6">
                  <Button color="primary" onClick={() => this.addNew('therapy_code')}>Add Service</Button>
                </Col>
              </Row>
          </TabPane>
       </TabContent>
      </Page>
    );
  }

  componentWillUnmount()
  {
  }
}

const mapStateToProps = state => {
  const { service, auth } = state

  return {
    service,
    auth
  }
}

export default connect(mapStateToProps)(SettingsPage);
