export default interface Locale {
	general: {
		invalid_mod: string;
		YenAwarded: string;
		TofuAwarded: string;
	};
    ban: {
        Reply: {
            Title: string;
            Desc: string;
            Desc2: string;
            Desc3: string;
            Desc4: string;
            NoReason: string;
            NoDM: string;
			noBanMe: string;
			noBanHigher: string;
			noBanOwner: string;
			BanErrorTitle: string;
			BanError: string;
        };

		Permissions: {
			OhDear: string;
			Desc: string;
		};

        randomResponse: Array<any>;
    };
	fluff: {
		RateLimit: string;
		UserInput: Array<any>;
		Responses: Array<any>;
	};
};