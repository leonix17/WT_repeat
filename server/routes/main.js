const express = require('express');
const router = express.Router(); // Create a router instance
const post=require('../models/post');
//Routes
// Get
// Home

router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "MoVieReviews",
            description: "Simple Page to review your Movies"
        };

        let perPage = 20;
        let page = req.query.page || 1;

        const data = await post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/' // Ensure currentRoute is passed
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/about',(req, res)=>{
    res.render('about',{
        currentRoute:'/about'
    });
});

router.get('/3diots.ejs',(req, res)=>{
    res.render('3diots',{
        currentRoute:'/3idiots'
    });
});

router.get('/baywatch.ejs', (req, res) => {
    res.render('baywatch',{
        currentRoute:'/baywatch'
    }); // This should match the view file in 'views/'
  });
  
router.get('/v.ejs',(req, res)=>{
    res.render('v',{
        currentRoute:'/v'
    });
});
router.get('/thenun.ejs',(req, res)=>{
    res.render('thenun',{
        currentRoute:'/thenun'
    });
});
router.get('/zodiac.ejs',(req, res)=>{
    res.render('zodiac',{
        currentRoute:'/zodiac'
    });
});
router.get('/piranah.ejs',(req, res)=>{
    res.render('piranah',{
        currentRoute:'/piranah'
    });
});
router.get('/deadpool3.ejs',(req, res)=>{
    res.render('deadpool3',{
        currentRoute:'/deadpool3'
    });
});
router.get('/findingnemo.ejs',(req, res)=>{
    res.render('findingnemo',{
        currentRoute:'/findingnemo'
    });
});
router.get('/cellular.ejs',(req, res)=>{
    res.render('cellular',{
        currentRoute:'/cellular'
    });
});
router.get('/fallguy.ejs',(req, res)=>{
    res.render('fallguy',{
        currentRoute:'/fallguy'
    });
});



module.exports =router;


//function insterPostData(){
//     post.insertMany([
//         {
//             title:"Building a Blog",
//             body: "This is the Body text"
//         }
//     ])
// }
// insterPostData();

//Routes
// Get
// post id

router.get('/post/:id', async(req, res)=>{
    
    try{
        const locals={
            title:"MoVieReviews",
            description: "Simple Page to review your Movies"
        }
        let slug = req.params.id;
        const data =  await post.findById({_id : slug});
        res.render('post',{locals,data});

       
    }catch(error){
        console.log(error);
    }
});

/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Search",
        description: "Searching"
      }
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
