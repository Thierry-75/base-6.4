<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ChangePasswordForm;
use App\Service\JwtService;
use App\Service\MailService;
use App\Service\IntraController;
use App\Repository\UserRepository;
use App\Form\ResetPasswordRequestForm;
use App\Message\ForgetPasswordMessage;
use App\Message\SendActivationMessage;
use App\Message\SendPasswordConfirm;
use App\Message\SendPasswordRequest;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Generator\UrlGenerator;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;

class SecurityController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {

        if ($this->getUser()) {
            return $this->redirectToRoute('app_main');
        }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(path: '/forgotten-password', name: 'forgotten_password', methods: ['GET', 'POST'])]
    public function forgottenPassword(
        Request $request,
        ValidatorInterface $validator,
        UserRepository $user_repository,
        TokenGeneratorInterface $tokenGenerator,
        EntityManagerInterface $em,
        MessageBusInterface $messageBus,
        IntraController $intraController,
    ): Response {
        $form = $this->createForm(ResetPasswordRequestForm::class);
        $form->handleRequest($request);
        if ($request->isMethod('POST')) {
            $errors = $validator->validate($request);
            if (count($errors) > 0) {
                return $this->render('security/reset_password_request.html.twig', ['requestForm' => $form->createView(), 'errors' => $errors]);
            }
            if ($form->isSubmitted() && $form->isValid()) {
                try {
                    $user = $user_repository->findByEmail($form->get('email')->getData());
                    $usr = (object) $user[0];
                    $token = $tokenGenerator->generateToken();
                    $usr->setResetToken($token);
                    $em->flush();
                    $url = $this->generateUrl('reset_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);
                    $messageBus->dispatch(new SendPasswordRequest($intraController->getWebmaster(), $usr->getEmail(), 'Demande mot de passe', 'password_reset', ['url' => $url, 'user' => $usr]));
                    $this->addFlash('alert-success', 'Lien email nouveau mot de passe envoyé !');
                    return $this->redirectToRoute('app_main');
                } catch (EntityNotFoundException $e) {
                    return $this->redirectToRoute('app_error', ['exception' => $e]);
                }
            }
        }
        return $this->render('security/reset_password_request.html.twig', ['requestForm' => $form->createView()]);
    }

    #[Route('/oubli-pass/{token}',name:'reset_password')]
    public function resetPass(string $token, Request $request, UserRepository $userRepository,ValidatorInterface $validator,
    EntityManagerInterface $entityManager,UserPasswordHasherInterface $userPasswordHasher,MessageBusInterface $messageBus): Response
    {
        // control jeton
        $user = $userRepository->findOneByResetToken($token);
        if(isset($user)){
            $form = $this->createForm(ChangePasswordForm::class);
            $form->handleRequest($request);
            if($request->isMethod('POST')){
                $errors = $validator->validate($request);
                if(count($errors)>0){
                    return $this->render('/security/reset.html.twig',['resetForm'=>$form->createView(),'errors'=>$errors]);
                }
                if($form->isSubmitted() && $form->isValid()){
                    $user->setResetToken('');
                    $user->setPassword(
                        $userPasswordHasher->hashPassword($user,$form->get('plainPassword')->getData())
                    );
                    try{
                        $entityManager->persist($user);
                        $entityManager->flush();
                        $webmaster ='webmaster@my-domain.org';
                        $url = $this->generateUrl('app_main', [], UrlGeneratorInterface::ABSOLUTE_URL);
                        $messageBus->dispatch(new SendPasswordConfirm($webmaster,$user->getEmail(),'Nouveau mot de passe','new_password',['user'=>$user,'url'=>$url]));
                        $this->addFlash('alert-success','Votre mot de passe a été modifié !');
                        return $this->redirectToRoute('app_login');
                    }catch (EntityNotFoundException $e){
                        return $this->redirectToRoute('app_error',['exception'=>$e]);
                    }
                }
            }
        }
        return $this->render('/security/reset.html.twig',['resetForm'=>$form->createView()]);
    }
}
