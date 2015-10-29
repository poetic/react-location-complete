var muiRef = mui;
const defaultInterval = 300;

styles = {
  span: { float: 'right', width: '80%', },
  icon: { float: 'left', width: '40px', height: '40px', lineHeight: '60px', },
  input: { marginTop: '30px', width: 'calc(100% - 30px)', padding: '15px', height: '50px', },
  ul: { listStyleType: 'none', margin: '0', padding: '15px 0 0 0', width: '100%', position: 'absolute', zIndex: '10', backgroundColor: 'white'},
  li: { width: '100%', padding: '15px', height: '80px', fontSize: '14px', },
};

export default React.createClass({

   childContextTypes: { muiTheme: React.PropTypes.object },

  getChildContext() {
    return { muiTheme: muiRef.Styles.ThemeManager().getCurrentTheme() };
  },

  componentWillMount(){
    this.styles = this.props.styles || styles;
    this.timer = new Date().getTime();
    this.formatted = [];
    this.Lat = new ReactiveVar();
    this.Lng = new ReactiveVar();
  },

  resetTimer(){ this.timer = new Date().getTime(); },

  isReady(){
    if(new Date().getTime() - this.timer > 600){ this.resetTimer(); return true; }

    return false;
  },

  componentDidMount(){
    if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(geoSuccess.bind(this), geoError); }
    this.setup();
  },

  setup(){
    if($('.hidden-maps').length > 0){ GoogleMaps.load({libraries: 'places'}); }

    if($('.hidden-maps').length > 0 && typeof(google) !== 'undefined'){
      this.service = new google.maps.places.PlacesService( document.getElementsByClassName('hidden-maps')[0] );
    } else { setTimeout(this.setup, defaultInterval); }
  },

  getBounds(){
    return new google.maps.LatLngBounds(new google.maps.LatLng(84, -179), new google.maps.LatLng(-84, 179));
  },

  searchForMatches(){
    this.service.textSearch({
      query: this.location,
      bounds: this.getBounds(),
      rankBy: google.maps.places.RankBy.DISTANCE
    }, this.update);
  },

  addressFromString(e, override){
    if(this.isReady() || override) {
      this.location = $(e.currentTarget).val();
      if (this.location && this.location.length) { this.searchForMatches();
      } else { this.update([]); }
    }
  },

  update(res){
    this.formatted = res.map(function(place){ return {location: place.formatted_address, icon: place.icon}; });
    this.forceUpdate();
  },

  setAddress(e){
    $('.location-input > input').val($(e.currentTarget).children()[1].innerHTML.substr(0, $(e.currentTarget).children()[1].innerHTML.indexOf(',')));
    this.addressFromString({currentTarget: null}, true);
    this.props.done($(e.currentTarget).children()[1].innerHTML.substr(0, $(e.currentTarget).children()[1].innerHTML.indexOf(',')));
  },

  render(){
    return (
      <div>
        <div className='hidden-maps'></div>
        <muiRef.TextField className='location-input' style={this.styles.input} hintText="Location" onChange={this.addressFromString} />
        <ul style={this.styles.ul}>
          {
            this.formatted.map(function(res, i){
              return (
                <li style={this.styles.li} key={i} onClick={this.setAddress}>
                  <img style={this.styles.icon} src={res.icon}></img>
                  <span style={this.styles.span}>{res.location}</span>
                </li>)
            }.bind(this))
          }
        </ul>
      </div>
    )
  }
});

let geoSuccess = function(pos){
  this.Lat.set(pos.coords.latitude);
  this.Lng.set(pos.coords.longitude);
};

let geoError = () => {
  let msg = 'Unable to retrieve location.';
  if (Meteor.isCordova && navigator.notification) {

    navigator.notification.alert(
        msg,
        function (){},
        'FPN',
        'Dismiss'
    );
  } else {
    alert(msg);
  }
};
