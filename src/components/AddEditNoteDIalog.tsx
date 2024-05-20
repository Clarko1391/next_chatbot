'use client'

import { CreateNoteSchema, createNoteSchema } from '@/lib/validation/note'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import LoadingButton from './ui/loading_button'
import { useRouter } from 'next/navigation'
import { Note as NoteModel } from '@prisma/client'

interface AddEditNoteDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void
    note_to_edit?: NoteModel
}

const AddEditNoteDialog = ({
    open,
    setOpen,
    note_to_edit
} : AddEditNoteDialogProps) => {

    const [ is_deleting, setIsDeleting ] = useState<boolean>(false)

    const router = useRouter();

    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: note_to_edit?.title ?? '',
            content: note_to_edit?.content ?? ''
        }
    })

    const onSubmit = async(input: CreateNoteSchema) => {
        try{
            if (note_to_edit) {
                // handle update of existing note
                const response = await fetch('/api/notes', {
                    method: 'PUT',
                    body: JSON.stringify({
                        id: note_to_edit.id,
                        ...input
                    })
                })

                if(!response.ok) throw Error('Status Code: ' + response.status)

            } else {
                // handle creation of new note
                const response = await fetch('/api/notes', {
                    method: 'POST',
                    body: JSON.stringify(input)
                })

                if(!response.ok) throw Error('Status Code: ' + response.status)

                form.reset();
            }

            router.refresh();
            setOpen(false);
        }
        catch (error) {
            console.log(error);
            alert(`Note ${note_to_edit ? 'creation' : 'updation'} failed, please try again`)
        }
    }

    async function deleteNote() {
        if (!note_to_edit) return;

        setIsDeleting(true)

        try {
            const response = await fetch('/api/notes', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: note_to_edit.id
                })
            })

            if(!response.ok) throw Error('Status Code: ' + response.status)

            router.refresh();
            setOpen(false);
        }
        catch (error) {
            console.log(error);
            alert(`Failed to delete note, please try again`)
        }
        finally {
            setIsDeleting(false)
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
                        {note_to_edit ? 'Add Note' : 'Edit Note'}
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
                        <DialogFooter
                            className="gap-1 sm:gap-0"
                        >
                            {
                                note_to_edit &&
                                <LoadingButton
                                        variant='destructive'
                                        loading={is_deleting}
                                        disabled={form.formState.isSubmitting}
                                        onClick={deleteNote}
                                        type='button'
                                    >
                                        Delete
                                </LoadingButton>
                            }
                            <LoadingButton
                                type='submit'
                                loading={form.formState.isSubmitting}
                                disabled={is_deleting}
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

export default AddEditNoteDialog