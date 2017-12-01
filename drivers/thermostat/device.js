'use strict';

const TadoDevice = require('../../lib/TadoDevice');
const Homey = require('homey');

class TadoDeviceThermostat extends TadoDevice {

	triggerFlowHumidity( device, tokens ) {
				this._flowTriggerHumidity
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}

	triggerFlowHeatingPower( device, tokens ) {
				this._flowTriggerHeatingPower
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}

	triggerFlowOpenWindow( device, tokens ) {
				this._flowTriggerOpenWindow
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}

	triggerFlowSmartHeating( device, tokens ) {
				this._flowTriggerSmartHeating
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}


	triggerFlowOutsideTemperature( device, tokens ) {
				this._flowTriggerOutsideTemperature
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}

	triggerFlowSolarIntensity( device, tokens ) {
				this._flowTriggerOutsideTemperature
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}

	triggerFlowWeather( device, tokens ) {
				this._flowTriggerWeather
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}

	triggerFlowPresence( device, tokens ) {
				this._flowTriggerPresence
						.trigger( device, tokens )
								//.then( this.log )
								.catch( this.error )
	}



	onInit() {
		super.onInit();
//console.log(this)

		this.registerCapabilityListener('target_temperature', this._onCapabilityTargetTemperature.bind(this))
		this.registerCapabilityListener('tado_manual', this._onCapabilityTadoManual.bind(this))

		this._flowTriggerHumidity = new Homey.FlowCardTriggerDevice('humidity').register();
		this._flowTriggerHeatingPower = new Homey.FlowCardTriggerDevice('heating_power').register();
		this._flowTriggerSmartHeating = new Homey.FlowCardTriggerDevice('smart_heating').register();
		this._flowTriggerOpenWindow = new Homey.FlowCardTriggerDevice('detect_open_window').register();
		this._flowTriggerOutsideTemperature = new Homey.FlowCardTriggerDevice('outside_temperature').register();
		this._flowTriggerSolarIntensity = new Homey.FlowCardTriggerDevice('solar_intensity').register();
		this._flowTriggerWeather = new Homey.FlowCardTriggerDevice('weather').register();
		this._flowTriggerPresence = new Homey.FlowCardTriggerDevice('presence_status').register();

	}

	_onState( state ) {
		//console.log('zone state:'); console.log(state)
		if( this.hasCapability('measure_temperature') && state.sensorDataPoints.insideTemperature ){
			var value = Math.round( 10 * state.sensorDataPoints.insideTemperature.celsius )/10
			if(this.getCapabilityValue('measure_temperature') !== value && value != undefined ){
				//console.log('insideTemperature for ' + this.__name + ' changed to: ' + value)
				this.setCapabilityValue('measure_temperature', value).catch( this.error );
			}
		}

		if( this.hasCapability('measure_humidity') && state.sensorDataPoints.humidity ){
			var value = Math.round( state.sensorDataPoints.humidity.percentage )
			if(this.getCapabilityValue('measure_humidity') !== value && value != undefined ){
				//console.log('Flow trigger for ' + this.__name + ': humidity changed to: ' + value)
				this.triggerFlowHumidity( this, {'percentage': value } )
				this.setCapabilityValue('measure_humidity', value ).catch( this.error );
			}
		}

		if( this.hasCapability('heating_power') && state.activityDataPoints.heatingPower ){
			var value = Math.round( state.activityDataPoints.heatingPower.percentage )
			if(this.getCapabilityValue('heating_power') !== value && value != undefined ){
				//console.log('Flow trigger for ' + this.__name + ': heatingPower changed to: ' + value)
				this.triggerFlowHeatingPower( this, {'percentage': value } )
				this.setCapabilityValue('heating_power', value ).catch( this.error );
			}
		}

		if( this.hasCapability('detect_open_window') ){
			var value = (state.openWindow !== null)
			if(this.getCapabilityValue('detect_open_window') !== value && value != undefined ){
				//console.log('Flow trigger for ' + this.__name + ': openWindow changed to: ' + value)
				this.triggerFlowOpenWindow( this, {'detection': value } )
				this.setCapabilityValue('detect_open_window', value ).catch( this.error );
			}
		}

		if( this.hasCapability('smart_heating') ){
			var value = (state.overlayType !== 'MANUAL')
			if(this.getCapabilityValue('smart_heating') !== value && value != undefined ){
				//console.log('Flow trigger for ' + this.__name + ': SmartHeating (overlayType) changed to: ' + value)
				this.triggerFlowSmartHeating( this, {'detection': value } )
				this.setCapabilityValue('smart_heating', value ).catch( this.error );
			}
		}

		if( this.hasCapability('target_temperature') ){
			if(state.setting.power == 'OFF' || !state.setting.temperature){
				switch(state.setting.type){
					case'HEATING':		var value = 5; break;
					case'HOT_WATER':	var value = 30; break;
				}
			} else {
				var value = Math.round( 10 * state.setting.temperature.celsius )/10;
			}
			if(this.getCapabilityValue('target_temperature') !== value ){
				//console.log('target_temperature for ' + this.__name + ' changed to: ' + value);
				this.setCapabilityValue('target_temperature', value ).catch( this.error );
			}
		}

		if( this.hasCapability('tado_manual') ){
			var value = (state.overlayType === 'MANUAL')
			if(this.getCapabilityValue('tado_manual') !== value ){
				this.setCapabilityValue('tado_manual', value ).catch( this.error );
			}
		}

	}

	_onWeather( state ) {
		//console.log('home weather state:'); console.log(state);
		if( this.hasCapability('measure_temperature.outside') && state.outsideTemperature ){
			var value = Math.round( 10 * state.outsideTemperature.celsius )/10
			if(this.getCapabilityValue('measure_temperature.outside') !== value ){
				//console.log('Flow trigger for ' + this.__name + ': outsideTemperature changed to: ' + value)
				this.triggerFlowOutsideTemperature( this, {'temperature': value } )
				this.setCapabilityValue('measure_temperature.outside', value ).catch( this.error );
			}
		}

		if( this.hasCapability('solar_intensity') && state.solarIntensity ){
			var value = Math.round( 10 * state.solarIntensity.percentage )/10
			if(this.getCapabilityValue('solar_intensity') !== value ){
				//console.log('Flow trigger for ' + this.__name + ': solarIntensity changed to: ' + value)
				this.triggerFlowSolarIntensity( this, {'intensity': value } )
				this.setCapabilityValue('solar_intensity', value ).catch( this.error );
			}
		}

		if( this.hasCapability('weather_state') && state.weatherState ){
			var value = (state.weatherState.value).toLowerCase()
			if(this.getCapabilityValue('weather_state') != value ){
				//console.log('Flow trigger for ' + this.__name + ': weatherState changed to: ' + value + ' (' + Homey.__( value ) + ')' )
				this.triggerFlowWeather( this, {'condition': Homey.__( value ), 'state': value } )
				this.setCapabilityValue('weather_state', value ).catch( this.error );
			}
		}

	}

	_onPresence( state ) {
		//console.log('home presence state:'); console.log(state);
		if( this.hasCapability('presence_status') ){
			var value = false;
			state.forEach(function(item, index){
				//console.log(''); console.log(item);
				if(item.settings.geoTrackingEnabled){
					if(item.location != null){
						value = (value || item.location.atHome)
					}
				}
			});
			if(this.getCapabilityValue('presence_status') != value ){
				//console.log('Flow trigger for ' + this.__name + ': Presence changed to: ' + value )
				this.triggerFlowPresence( this, {'presence': value } )
				this.setCapabilityValue('presence_status', value ).catch( this.error );
			}
		}
	}

	onFlowActionSetSmart() {
		this._api.unsetOverlay( this._homeId, this._zoneId);
		return true;
	}

	onFlowActionSetOff() {
		this._api.setOverlay( this._homeId, this._zoneId, {
			"setting": {
				"type": this._type,
				"power": "OFF"
			},
			"termination": {
				"type": "MANUAL"
			}
		});
		return true;
	}

	async _onCapabilityTargetTemperature( value ) {
		return this._api.setOverlay( this._homeId, this._zoneId, {
			"setting": {
				"type": this._type,
				"power": "ON",
				"temperature": {
					"celsius": value
				}
			},
			"termination": {
				"type": "MANUAL"
			}
		}).then(() => {
			return Promise.resolve( this.getState() );
		})
		return true;
	}

	async _onCapabilityTadoManual( value ) {
			return this._api.unsetOverlay( this._homeId, this._zoneId ).then(() => {
				return Promise.resolve( this.getState() );
			});
	}

}

module.exports = TadoDeviceThermostat;
