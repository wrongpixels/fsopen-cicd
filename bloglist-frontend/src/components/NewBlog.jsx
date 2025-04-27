import useInputField from '../hooks/useInputField.js'
import useNotification from '../hooks/useNotification.js'
import { Form, Button } from 'react-bootstrap'
import styles from './styles/componentStyles.js'

const NewBlog = ({ addNewBlog }) => {
  const { showNotification } = useNotification()
  const [title, titleProps, titleFns] = useInputField(
    'text',
    'Title',
    'Title',
    'blog-title'
  )
  const [author, authorProps, authorFns] = useInputField(
    'text',
    'Author',
    'Author',
    'blog-author'
  )
  const [url, urlProps, urlFns] = useInputField(
    'text',
    'Url',
    'URL',
    'blog-url'
  )

  const handleAddBlog = async (event) => {
    event.preventDefault()
    if (!title || !author || !url) {
      showNotification('Cannot add an entry with empty fields!')
      return
    }
    const newBlog = await addNewBlog({ title, author, url })
    if (newBlog && newBlog.title === title) {
      titleFns.clean()
      authorFns.clean()
      urlFns.clean()
    }
  }

  return (
    <div className="w-75 mx-auto">
      <Form onSubmit={handleAddBlog} {...styles.bubble}>
        <div className="pt-2 pb-1">
          <h4>
            <b>New Blog:</b>
          </h4>
        </div>
        <Form.Group>
          <div>
            <Form.Control {...titleProps} {...styles.formField} />
          </div>
          <div>
            <Form.Control {...authorProps} {...styles.formField} />
          </div>
          <div>
            <Form.Control {...urlProps} {...styles.formField} />
          </div>
        </Form.Group>
        <Button variant="primary" type="submit" {...styles.normalButton}>
          Add entry
        </Button>
      </Form>
    </div>
  )
}
export default NewBlog
