import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    password: Yup.string().required('Senha obrigatória'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro na recuperação de senha',
                    description:
                        'Ocorreu um erro na recuperação de senha, tente novamente.',
                });
            }
        },
        [addToast],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <h1>Recuperar senha</h1>
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Button type="submit">Recuperar</Button>
                        <a href="forgot">Esqueci minha senha</a>
                    </Form>
                    <Link to="/">
                        <FiLogIn />
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default ForgotPassword;
