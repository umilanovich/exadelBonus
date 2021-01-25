import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { IOffice, IBonus } from 'interfaces/.';

@Injectable()
export class MarkersService{
    private iconSize: L.PointExpression = [32, 32];
    private iconAnchor: L.PointExpression = [32, 32];
    private popupAnchor: L.PointExpression = [-15, -35];

    private bonusMarkerIco = new L.Icon({
        iconUrl: '/assets/icons/marker.png',
        iconSize: this.iconSize,
        iconAnchor: this.iconAnchor,
        popupAnchor: this.popupAnchor
    });

    private officeMarkerIco = new L.Icon({
        iconUrl: '/assets/icons/office.png',
        iconSize: this.iconSize,
        iconAnchor: this.iconAnchor,
        popupAnchor: this.popupAnchor
    });

    createOfficesMarkers(offices: IOffice[]): L.Marker[]{
        const markers: L.Marker[] = offices.map((office: IOffice) => {
            return new L.Marker(
                [office.latitude, office.longitude],
                {icon: this.officeMarkerIco});
        });
        return markers;
    }

    private nestedBonusLocationsMarkerGenerator(bonus: IBonus): L.Marker[]{
        const markers: L.Marker[] = bonus.locations.map( location => {
            return new L.Marker(
                [location.coordinates.latitude, location.coordinates.longitude],
                {icon: this.bonusMarkerIco}
            );
        });
        return markers;
    }

    createBonusesMarkers(bonuses: IBonus[]): L.Marker[]{
        let markers: L.Marker[] = [];
        bonuses.map((bonus: IBonus) => {
            const bonusLocationsMarkers = this.nestedBonusLocationsMarkerGenerator(bonus);
            markers = [...markers, ...bonusLocationsMarkers];
        });
        return markers;
    }
}