import type { ValueObjectProps } from '@cellix/domain-seedwork/value-object';
import { ValueObject } from '@cellix/domain-seedwork/value-object';

export interface AddressProps extends ValueObjectProps {
	street: string;
	city: string;
	state: string | null;
	postalCode: string;
	country: string;
}

export class Address extends ValueObject<AddressProps> {
	get street(): string {
		return this.props.street;
	}
	set street(street: string) {
		this.props.street = street;
	}
	get city(): string {
		return this.props.city;
	}
	set city(city: string) {
		this.props.city = city;
	}
	get state(): string | null {
		return this.props.state;
	}
	set state(state: string | null) {
		this.props.state = state;
	}
	get postalCode(): string {
		return this.props.postalCode;
	}
	set postalCode(postalCode: string) {
		this.props.postalCode = postalCode;
	}
	get country(): string {
		return this.props.country;
	}
	set country(country: string) {
		this.props.country = country;
	}
}
