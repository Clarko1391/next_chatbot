import { CreateNoteSchema, createNoteSchema } from '@/lib/validation/note'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import LoadingButton from './ui/loading_button'
import { useRouter } from 'next/navigation'

interface AddNoteDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void
}

const AddNoteDialog = ({
    open,
    setOpen
} : AddNoteDialogProps) => {
    const router = useRouter();

    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: '',
            content: ''
        }
    })

    const onSubmit = async(input: CreateNoteSchema) => {
        try{
            const response = await fetch('/api/notes', {
                method: 'POST',
                body: JSON.stringify(input)
            })

            if(!response.ok) throw Error('Status Code: ' + response.status)

            form.reset();
            router.refresh();
            setOpen(false);
        }
        catch (error) {
            console.log(error);
            alert("Note creation failed, please try again")
        }
    }

    return (
        <Dialog 
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add New Note
                    </DialogTitle>
                </DialogHeader>
                <Form
                    {...form}
                >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
                        <FormField 
                            control={form.control}
                            name='title'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Note Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Give your note a memorable title' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name='content'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Note Title</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='What do you want to record' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <LoadingButton
                                loading={form.formState.isSubmitting}
                            >
                                Submit
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddNoteDialog