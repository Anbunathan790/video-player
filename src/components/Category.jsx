import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { addToCategory, deleteCat, getAVideo, getAllCategory, updateCategory, } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Row } from 'react-bootstrap';
import VideoCard from './VideoCard';
import { Col } from 'react-bootstrap';


function Category() {


  const [show, setShow] = useState(false)
 const [Category , setCategory] = useState()
  const [CategoryName, setCategoryName]= useState("")
  const handleClose = () =>setShow(false)
  const handleShow = ()  =>setShow(true)

  //function to add category
  const handleCat = async()=>{
    console.log(CategoryName);
     if(CategoryName)
    {
      let body={
        CategoryName,
        allvideoes:[]
      }
      const response=await addToCategory(body)
      console.log(response);
      if(response.status>=200 && response.status<300){

        toast.success("Category added Suceesfully")
        setCategoryName('')
        allCategory()

        // to empty the state
        setCategoryName('')
        // close model
        handleClose()
      }
      else{
        toast.error("Something went wrong please try again later");
      }
    }
    else
    {
      toast.warning("please fill the category name")
    }
    
  } 

  //function to get all category
  const allCategory = async()=>{
    const {data} = await getAllCategory()
/*     console.log(data);
 */
setCategory(data)  
}
  console.log(Category);
  useEffect(()=>{
    allCategory()
  },[])

  // function to remove category
const removeCat = async(id)=>{
  await deleteCat(id)
  allCategory()
} 
  //function to prevent reload

  const dragOver = (e)=>{
    e.preventDefault()
  }

  //function to drop videocard to category
  const VideoDrop = async(e,Categoryid)=>{
    console.log(`category in which videocard is dropped:${Categoryid}`);
    let videoID = e.dataTransfer.getData("videoID")
    console.log(videoID);
 

   //api to get a video

   const {data} = await getAVideo(videoID)
   console.log(data);
  
   let selectedCategory = Category.find((item)=>item?.id==Categoryid)
   selectedCategory.allvideoes.push(data)
   console.log(selectedCategory);

    await updateCategory(Categoryid,selectedCategory)
    allCategory()

  }
   
  useEffect(()=>{
    allCategory()
  },[])

  return (
    <>
    <div className="d-flex justify-content-between align-items-center">
          <button onClick={handleShow} className='btn btn-warning d-flex justify-content-between align-items-center'>add new category</button>
        </div>
    <div>
      {
        Category?.length>0?
        Category?.map((item)=>(<div className="m-5 border border-secondary p-3 rounded" droppable onDragOver ={(e)=> dragOver(e) } onDrop={(e)=>VideoDrop(e,item?.id)} >
        <div className="d-flex justify-content-between align-items-center">
          <h6>{item.CategoryName}</h6>
          <button onClick={()=>{removeCat(item?.id)}} className="btn btn-danger"><i class="fa-solid fa-trash-can"></i></button>
        </div>

        <Row>

        <Col>
        {
          item?.allvideoes.length>0?
          item?.allvideoes.map((card)=>(<VideoCard display={card}/>))
          : <p>nothing to display</p>
        }
        </Col>  
        
        </Row>
      </div>)):<p>Nothing To Display</p>
      }
      
    <Modal show={show}
        onHide={handleClose}
        
        backdrop="static"
        keyboard={false}>
      
        <Modal.Header closeButton>
          <Modal.Title>add new category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <form  className='border border-secondary p-3 rounded'>

         <Form.Group className="mb-3"  controlId="formBasicEmail">
            <Form.Control type="text" onChange={(e)=>setCategoryName(e.target.value)} placeholder="Enter category name" />
           </Form.Group>
         </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCat}> add</Button>
        </Modal.Footer>
      </Modal>
      </div>
      <ToastContainer position='top-center' theme='colored' autoClose={2000}/>

    </>
  )
}

export default Category