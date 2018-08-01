
import React from 'react';

import {
  Row,
  Col,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label } from 'reactstrap';
import classnames from 'classnames';

import Page from 'components/Page';

import ReactTable from "react-table";
import "react-table/react-table.css";
import { rename } from 'fs';
import { setServiceResult } from '../actions';
import agent from '../agent';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import _ from 'lodash';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
  MdImportantDevices,
  // MdCardGiftcard,
  MdLoyalty,
} from 'react-icons/lib/md';
class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      service: this.props.service.service ? this.props.service.service : [],
      service_code: this.props.service.therapy_code ? this.props.service.therapy_code : [],
      serviceColumn: [],
      new_therapy_service: 'New Therapy Service',
      count: 0,
      add_service: '',
      service_initial: [],
      service_value: '',
      insurance_provider_value: '',
      add_insurance_provider: '',
      editModalShow: false,
      service_to_change: '',
      service_change_value: ''
    };
    this.renderEditable = this.renderEditable.bind(this);
    this.handleServiceSelectChange = this.handleServiceSelectChange.bind(this);
    this.handleInsuranceProviderSelectChange = this.handleInsuranceProviderSelectChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  renameKeys() {
    let newObj = {}, flag = false;

      Object.keys(this.state.service[0]).map(key => {
        if (key == this.state.service_change_value)
          flag = true;
      })
    if (flag)
    {
      alert('Service code is duplicated!!!');
      return;
    }
    this.state.service.map((el, index) => {
      Object.keys(el).map((key) => {
        if (key == this.state.service_to_change)
        {
          newObj[this.state.service_change_value] = el[key];
        }
        else
        {
          newObj[key] = el[key];
        }
      });
      this.state.service[index] = newObj;
    })
    this.forceUpdate();
    this.setState({editModalShow: false})
  }
  
  handleServiceSelectChange(value) {
    this.setState({service_value: value});
  }

  handleInsuranceProviderSelectChange(value) {
    this.setState({insurance_provider_value: value});
  }

  renderEditable(cellInfo) {
    if (
      cellInfo.column.Header === 'Insurance Provider')
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
    else if (cellInfo.column.Header === 'Services')
    {
      return (
        <div
          style={{ backgroundColor: "#fafafa" }}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{
            __html: Object.keys(this.state.service[0])[cellInfo.index]
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
  removeService() {
    var services = [];
    _.map(this.state.service_value, (value) => {
      services.push(value.label);
    })
    var removedService = _.map(this.state.service, function (service) {
      return _.omit(service, services);
    });
    this.state.service = removedService;
    _.pullAll(this.state.service_code, services);
    this.forceUpdate();
    this.generateServiceColumn();
    this.setSelectValue();
  }

  removeInsuranceProvider() {
    var insurance_provider = [];
    _.map(this.state.insurance_provider_value, (value) => {
      insurance_provider.push(value.label);
    })
    var removedInsuranceProvider = this.state.service.filter((el) => {
      return insurance_provider.indexOf(el.provider) < 0
    })
    this.state.service = removedInsuranceProvider;
    this.forceUpdate();
    this.setSelectValue();
  }

  toggleModal()
  {
    this.setState({
      editModalShow: !this.state.editModalShow
    });
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
      let flag = false;
      this.state.service.map(service => {
        if (service.provider == this.state.add_insurance_provider)
          flag = true;
      });
      if (flag == true)
      {
        setTimeout(() => {
          if (!this.notificationSystem) {
            return;
          }
      
          this.notificationSystem.addNotification({
            title: <MdImportantDevices />,
            message: `Duplicated Insurance Provider!`,
            level: 'error',
          });
        }, 500);
      }
      else {
        let service_object = {};
        service_object['provider'] = this.state.add_insurance_provider;
        this.state.service_code.map(code => {
          service_object[code] = 0;
        })
        this.state.service.push(service_object);
      }
    }
    else {
      if (this.state.service_code.indexOf(this.state.add_service) > -1)
      {
        setTimeout(() => {
          if (!this.notificationSystem) {
            return;
          }
      
          this.notificationSystem.addNotification({
            title: <MdImportantDevices />,
            message: `Duplicated Service!`,
            level: 'error',
          });
        }, 500);
      }
      else
      {
        this.state.service_code.push(this.state.add_service)
        this.state.service.map(e => {
            e[this.state.add_service] = 0
        })
      }
    }
    this.setSelectValue();
    this.generateServiceColumn();
    this.forceUpdate();
  }

  save() {
    agent.Service.save(this.state.service, this.state.service_code);
    this.props.dispatch(setServiceResult({service: this.state.service}))
  }

  generateServiceColumn() {
    const serviceColumn = [];

    if (this.state.service && this.state.service.length > 0)
    {
      Object.keys(this.state.service[0]).map(key => {
        if (key != 'provider')
          serviceColumn.push({
            Header: key,
            id: key,
            Cell: this.renderEditable
            });    
        else
          serviceColumn.unshift({
            Header: key,
            id: key,
            Cell: this.renderEditable
            });      
      })
      this.setState({serviceColumn});
    }
  }
  
  setSelectValue() {
    let services = [], insurance_provider = [];
    if (this.state.service_code && this.state.service_code.length > 0 )
    {
      this.state.service_code.map(service => {
          services.push({value: service, label: service});
      });
      this.setState({service_initial: services});
    }
    if (this.state.service && this.state.service.length > 0) {
      this.state.service.map(service => {
        insurance_provider.push({value: service.provider, label: service.provider});
      })
      this.setState({insurance_provider_initial: insurance_provider})
    }
    else if (this.state.service)
    {
      this.setState({insurance_provider_initial: []})
    }
  }

  componentWillMount() {
    if(!this.props.auth.token)
      this.props.history.push('/');
    this.setSelectValue();
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
              {
                this.state.service.length > 0 ? (
                  <div>
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
                  </div>
                ): (
                  <div style={{marginTop: '20px', marginLeft: '20px'}}>No Data!!!</div>
                )
              }
              <Col sm="12" className="pull-right">
                <Button style={{float:'right'}}>Cancel</Button>
                <Button color="primary" onClick={() => this.save()} style={{float:'right', marginRight: '20px'}}>Save</Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row style={{marginTop: '30px'}}>
              <Col sm="6">
                {
                  this.state.service.length > 0 ? (
                    <ReactTable
                        data={this.state.service}
                        columns={[{
                          Header: "Insurance Provider",
                          id: 'service',
                          Cell: this.renderEditable
                          }]}
                          defaultPageSize={this.state.service.length}
                          pageSize={this.state.service.length}
                          className="-striped -highlight"
                          showPageSizeOptions= {true}
                          showPagination= {false}
                      />
                  ): (
                    <div>No Data!!!</div>
                  )
                }
              </Col>
              <Col sm="6">
              <Col sm="12" style={{marginBottom: '50px'}}>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                      <Button color="primary" onClick={() => this.addNew('insurance_provider')}>Add Insurance Provider</Button>
                      </div>
                    </Col>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                        <Input
                          value={this.state.add_insurance_provider}
                          onChange={(event) => {this.state.add_insurance_provider = event.target.value; this.forceUpdate()}}
                        />
                      </div>    
                    </Col>
                  </Col>
                  <Col sm="12" style={{marginBottom: '50px'}}>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                       <Button color="primary" onClick={() => this.removeInsuranceProvider()}>Remove Insurance Provider</Button>
                      </div>
                    </Col>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                        <Select
                        name="form-field-name"
                        value={this.state.insurance_provider_value}
                        options={this.state.insurance_provider_initial}
                        multi
                        onChange={this.handleInsuranceProviderSelectChange}
                        />
                      </div>    
                    </Col>
                  </Col>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row style={{marginTop: '30px'}}>
                <Col sm="6">
                {
                  this.state.service_code.length > 0 ? (
                    <ReactTable
                    data={this.state.service_code}
                    columns={[{
                      Header: "Services",
                      id: 'therapy',
                      accessor: 'therapy',
                      Cell: this.renderEditable
                      }]}
                      defaultPageSize={this.state.service_code.length}
                      pageSize={this.state.service_code.length}
                      className="-striped -highlight"
                      showPageSizeOptions= {true}
                      showPagination= {false}
                  />
                  ): (
                    <div>No data!!!</div>
                  )
                }
                </Col>
                <Col sm="6">
                  <Col sm="12" style={{marginBottom: '50px'}}>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                       <Button color="primary" onClick={() => this.addNew('therapy_code')}>Add Service</Button>
                      </div>
                    </Col>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                        <Input
                          value={this.state.add_service}
                          onChange={(event) => {this.state.add_service = event.target.value; this.forceUpdate()}}
                        />
                      </div>    
                    </Col>
                  </Col>
                  <Col sm="12" style={{marginBottom: '50px'}}>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                       <Button color="primary" onClick={() => this.removeService()}>Remove Service</Button>
                      </div>
                    </Col>
                    <Col sm="6" style={{display: 'inline-block'}}>
                      <div style={{display: 'grid'}}>
                        <Select
                        name="form-field-name"
                        value={this.state.service_value}
                        options={this.state.service_initial}
                        multi
                        onChange={this.handleServiceSelectChange}
                        />
                      </div>    
                    </Col>
                  </Col>
                  <Col sm="12">
                    <Col sm="6">
                    <Button color="primary" onClick={this.toggleModal}>Rename Service</Button>
                      <Modal
                        isOpen={this.state.editModalShow}
                        toggle={this.toggleModal}
                        >
                        <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
                        <ModalBody>
                          <FormGroup>
                            <Label for="add_session_per_week">Session Per Week</Label>
                            <Input
                              onChange={(event) => {this.setState({service_to_change :event.target.value})}}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="add_length_of_session">Length of Session(Hrs)</Label>
                            <Input
                              onChange={(event) => {this.setState({service_change_value :event.target.value})}}
                            />
                          </FormGroup>

                        </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={() => this.renameKeys()}>
                            Confirm
                          </Button>{' '}
                          <Button color="secondary" onClick={() => this.setState({editModalShow: false})}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </Col>
                    </Col>
                </Col>
              </Row>
          </TabPane>
       </TabContent>
       <NotificationSystem
         dismissible={false}
         ref={notificationSystem =>
           (this.notificationSystem = notificationSystem)
         }
         style={NOTIFICATION_SYSTEM_STYLE}
       />
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
