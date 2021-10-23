export interface BurgerI {
	_id?: string;
	name: string;
	price: number;
	size: string;
	img: string;
	category: String;
	nutritionDetails: NutritionDetailsI;
}

export interface NutritionDetailsI {
	proteins: DetailsI;
	calorys: DetailsI;
	carbohydrates: DetailsI;
	sugars: DetailsI;
	fats: DetailsI;
	saturatedFats: DetailsI;
	transFats: DetailsI;
	sodium: DetailsI;
}

export interface DetailsI {
	name: string;
	number: number;
	type: string;
}