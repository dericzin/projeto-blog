const express = require("express");
const app = express();
const connection = require("./database/database")
const session = require("express-session")

const CategoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const adminController = require("./admin/AdminController");

const Category = require("./categories/Category");
const Article = require("./articles/Article");
const Admin = require("./admin/Admin")


// VIEW ENGINE
app.set('view engine', 'ejs');


// Sessions


app.use(session({
    secret: "cenoura",
    cookie: { maxAge: 30000000 }
}))

// STATIC
app.use(express.static('public'));

// Body parser incluído no express!
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database

connection.authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    })



app.use("/", CategoriesController);

app.use("/", articlesController);

app.use("/", adminController);


app.get("/session", (req, res) => {
    req.session.treinamento ="Formação Node.js"
    req.session.ano = 2019
    req.session.email = "tdrb_@user.com"
    req.session.user = {
        username: "Thiaguinho",
        email: "tdrb_@user.com"
    }
    res.send("Sessão gerada!");
});

app.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
});


app.get("/", (req, res) => {

    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch(erro => {
        res.redirect("/");
    });
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {

            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    })
});



const port = 3000

app.listen(port, () => {
    console.log("App running on the port: ", port);
})