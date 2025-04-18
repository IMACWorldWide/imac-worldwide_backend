import express, { Request, Response } from "express";
import cors from "cors";

import relations from "../database/relations.json";
import experiences from "../database/experiences.json";
import countries from "../database/countries.json";
import languages from "../database/languages.json";
import tags from "../database/tags.json";
import e from "express";

// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;

// Enable CORS for all origins with credentials
app.use(cors({ origin: true, credentials: true }));

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.get("/relations", (req: Request, res: Response) => {
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const compareField = req.query.sort ? req.query.sort as string : "name";

    const compareFn = (a: any, b: any) => {
        if (a[compareField] < b[compareField]) return -1;
        if (a[compareField] > b[compareField]) return 1;
        return 0;
    };

    let result = Object.values(relations).sort(compareFn).slice(offset, offset + limit).map((relation) => (
        {
            id: relation.id,
            code: relation.code,
            name: relation.name,
            description: relation.description,
            locations: relation.locations,
            imageURL: relation.imageURL,
            country: countries[relation.country] ? countries[relation.country] : null,
            languages: relation.languages.filter((language: string) => (languages[language])).map((language: string) => (languages[language])),
            tags: relation.tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
        }
    ));
    res.json(result);
});

app.get("/experiences", (req: Request, res: Response) => {
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const compareField = req.query.sort ? req.query.sort as string : "name";

    const compareFn = (a: any, b: any) => {
        if (a[compareField] < b[compareField]) return -1;
        if (a[compareField] > b[compareField]) return 1;
        return 0;
    };

    let result = Object.values(experiences).sort(compareFn).slice(offset, offset + limit).map((experience) => (
        {
            id: experience.id,
            title: experience.title,
            summary: experience.summary,
            imageURL: experience.imageURL,
            departure_date: experience.departure_date,
            return_date: experience.return_date,
            relation: relations[experience.relation] ?
                {
                    id: relations[experience.relation].id,
                    code: relations[experience.relation].code,
                    name: relations[experience.relation].name,
                    description: relations[experience.relation].description,
                    locations: relations[experience.relation].locations,
                    imageURL: relations[experience.relation].imageURL,
                    country: countries[relations[experience.relation].country] ? countries[relations[experience.relation].country] : null,
                    languages: relations[experience.relation].languages.filter((language: string) => (languages[language])).map((language: string) => (languages[language])),
                    tags: relations[experience.relation].tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
                } : null,
            tags: experience.tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
            courses: experience.courses.map((course) => (
                {
                    name: course.name,
                    description: course.description,
                    language: languages[course.language] ? languages[course.language] : null
                }
            )),
            contact: experience.contact
        }
    ));
    res.json(result);
});

app.get("/relation/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const relation = relations[id];
    if (relation) {
        res.json({
            id: relation.id,
            code: relation.code,
            name: relation.name,
            description: relation.description,
            locations: relation.locations,
            imageURL: relation.imageURL,
            country: countries[relation.country] ? countries[relation.country] : null,
            languages: relation.languages.filter((language: string) => (languages[language])).map((language: string) => (languages[language])),
            tags: relation.tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
        });
    } else {
        res.status(404).json({ message: "Relation not found" });
    }
});

app.get("/relation/:code/experiences", (req: Request, res: Response) => {
    const code = req.params.code;

    let result = experiences.filter((experience) => {
        return experience.relation === code;
    }).map((experience) => (
        {
            id: experience.id,
            title: experience.title,
            summary: experience.summary,
            imageURL: experience.imageURL,
            departure_date: experience.departure_date,
            return_date: experience.return_date,
            relation: {
                id: relations[experience.relation].id,
                code: relations[experience.relation].code,
                name: relations[experience.relation].name,
                description: relations[experience.relation].description,
                locations: relations[experience.relation].locations,
                imageURL: relations[experience.relation].imageURL,
                country: countries[relations[experience.relation].country] ? countries[relations[experience.relation].country] : null,
                languages: relations[experience.relation].languages.filter((language: string) => (languages[language])).map((language: string) => (languages[language])),
                tags: relations[experience.relation].tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
            },
            tags: experience.tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
            courses: experience.courses,
            contact: experience.contact
        }
    ));

    res.json(result);
});

app.get("/experience/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const experience = experiences[id];
    if (experience) {
        res.json({
            id: experience.id,
            title: experience.title,
            summary: experience.summary,
            imageURL: experience.imageURL,
            departure_date: experience.departure_date,
            return_date: experience.return_date,
            relation: {
                id: relations[experience.relation].id,
                code: relations[experience.relation].code,
                name: relations[experience.relation].name,
                description: relations[experience.relation].description,
                locations: relations[experience.relation].locations,
                imageURL: relations[experience.relation].imageURL,
                country: countries[relations[experience.relation].country] ? countries[relations[experience.relation].country] : null,
                languages: relations[experience.relation].languages.filter((language: string) => (languages[language])).map((language: string) => (languages[language])),
                tags: relations[experience.relation].tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
            },
            tags: experience.tags.filter((tag: string) => (tags[tag])).map((tag: string) => (tags[tag])),
            courses: experience.courses.map((course) => (
                {
                    name: course.name,
                    description: course.description,
                    language: languages[course.language] ? languages[course.language] : null
                })),
            contact: experience.contact
        });
    }
    else {
        res.status(404).json({ message: "Experience not found" });
    }
});

app.get("/countries", (req: Request, res: Response) => {

    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const compareField = req.query.sort ? req.query.sort as string : "name";

    const compareFn = (a: any, b: any) => {
        if (a[compareField] < b[compareField]) return -1;
        if (a[compareField] > b[compareField]) return 1;
        return 0;
    };

    let result = Object.values(countries).sort(compareFn).slice(offset, offset + limit).map((country) => (
        {
            code: country.code,
            name: country.name,
            emoji: country.emoji,
            flagSource: country.flagSource
        }
    ));
    res.json(result);
});

app.get("/relations/countries", (req: Request, res: Response) => {
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const compareField = req.query.sort ? req.query.sort as string : "name";

    const compareFn = (a: any, b: any) => {
        if (a[compareField] < b[compareField]) return -1;
        if (a[compareField] > b[compareField]) return 1;
        return 0;
    };

    let result = Object.values(relations).sort(compareFn).slice(offset, offset + limit).map((relation) => (
        countries[relation.country] ? countries[relation.country] : null
    ));
    res.json([...new Set(result)]);
});

app.get("/relations/tags", (req: Request, res: Response) => {
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const compareField = req.query.sort ? req.query.sort as string : "name";

    const compareFn = (a: any, b: any) => {
        if (a[compareField] < b[compareField]) return -1;
        if (a[compareField] > b[compareField]) return 1;
        return 0;
    };

    let result: object[] = [];
    Object.values(relations).sort(compareFn).slice(offset, offset + limit).forEach((relation) => {
        relation.tags.forEach((tag: string) => {
            if (tags[tag]) {
                result.push(tags[tag]);
            }
        }
        )
    });
    res.json([...new Set(result)]);
});

app.get("/experiences/countries", (req: Request, res: Response) => {
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const compareField = req.query.sort ? req.query.sort as string : "name";

    const compareFn = (a: any, b: any) => {
        if (a[compareField] < b[compareField]) return -1;
        if (a[compareField] > b[compareField]) return 1;
        return 0;
    };

    let result = Object.values(experiences).sort(compareFn).slice(offset, offset + limit).map((experience) => (
        relations[experience.relation] ? countries[relations[experience.relation].country] : null
    ));
    res.json([...new Set(result)]);
});

app.get("/experiences/tags", (req: Request, res: Response) => {
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const compareField = req.query.sort ? req.query.sort as string : "name";

    const compareFn = (a: any, b: any) => {
        if (a[compareField] < b[compareField]) return -1;
        if (a[compareField] > b[compareField]) return 1;
        return 0;
    };
    let result: object[] = [];

    Object.values(experiences).sort(compareFn).slice(offset, offset + limit).forEach((experience) => {
        experience.tags.forEach((tag: string) => {
            if (tags[tag]) {
                result.push(tags[tag]);
            }
        }
        )
    });
    res.json([...new Set(result)]);
});



// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});