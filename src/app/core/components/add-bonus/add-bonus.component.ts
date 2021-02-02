import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BonusAddressService } from '../../services/bonus-address.service';
import { ITag, ILocation } from '../../interfaces/add-bonus.interface';

@Component({
  selector: 'app-add-bonus',
  templateUrl: './add-bonus.component.html',
  styleUrls: ['./add-bonus.component.scss'],
})

export class AddBonusComponent implements OnInit {
  public subscription: Subscription = new Subscription();
  public myForm: FormGroup;
  public vendorName: FormControl;
  public range: FormGroup;
  public locations: ILocation[] = [];
  public visible: boolean = true;
  public selectable: boolean = true;
  public removable: boolean = true;
  public addOnBlur: boolean = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public bonusTags: ITag[] = [];

  constructor(private bonusAddressService: BonusAddressService) {}

  ngOnInit() {
    this.myForm = new FormGroup({
      vendorName: new FormControl('', [Validators.required]),
      bonusAddress: new FormControl('', [Validators.required]),
      bonusType: new FormControl('', [Validators.required]),
      bonusDescription: new FormControl('', [Validators.required]),
      bonusTags: new FormControl('', [Validators.required]),
      bonusValue: new FormControl('', [Validators.required]),
      vendorEmail: new FormControl('', [Validators.required, Validators.email]),
      vendorPhone: new FormControl('', [Validators.required]),
      bonusDateRange: (this.range = new FormGroup({
        start: new FormControl('', [Validators.required]),
        end: new FormControl('', [Validators.required]),
      })),
    });
  }

  public onSubmit(): void {
    const formValue = this.myForm.value;
    const submitedBonus = {
      company: {
        name: formValue.vendorName,
        phone: formValue.vendorPhone,
        email: formValue.vendorEmail,
      },
      dateStart: formValue.bonusDateRange.start,
      dateEnd: formValue.bonusDateRange.end,
      description: formValue.bonusDescription,
      type: formValue.bonusType,
      discount: formValue.bonusValue,
      locations: this.locations,
      bonusTags: this.bonusTags.map((tag) => tag.name),
    };

    //TODO: add service for post submitedBonus...
  }

  public onCheckAddress() {
    this.onAddAddress();
  }

  public onAddAddress() {
    if (this.myForm.value.bonusAddress) {
      this.subscription.add(
        this.bonusAddressService
          .getSearchedAddress(this.myForm.value.bonusAddress)
          .subscribe((data) => {
            if (data.length > 0 && data[0].components.city) {
              this.locations.push({
                coordinates: {
                  latitude: data[0].geometry.lat,
                  longitude: data[0].geometry.lng,
                },
                city: data[0].components.city,
                country: data[0].components.country,
                address:
                  data[0].components.road && data[0].components.house_number
                    ? `${data[0].components.road}, ${data[0].components.house_number}`
                    : '',
              });
            } else {
              this.myForm.get('bonusAddress').reset();
              // TODO: add notification "No such address exists or address is not complete!"
            }
          })
      );
    }
  }

  public onAddTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.bonusTags.push({ name: value.trim() });
    }
    if (input) {
      input.value = '';
    }
  }

  public onRemoveTag(tag: ITag): void {
    const index = this.bonusTags.indexOf(tag);
    if (index >= 0) {
      this.bonusTags.splice(index, 1);
    }
  }

  public onAddAddressValue(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.onAddAddress();
    }
    if (input) {
      input.value = '';
    }
  }

  public onRemoveAddress(location: ILocation): void {
    const index = this.locations.indexOf(location);
    if (index >= 0) {
      this.locations.splice(index, 1);
    }
  }
}